# Backend Validation Fixes Required

## Issue 1: Category Breakdown Percentages Not Being Used in Validation

### Problem
The validation rules `jurisdiction_compliance` and `jurisdiction_specific_goals` are showing incorrect percentages (0.00%) for VSBE, MBE, SBE, and WBE calculations. They are not considering the category breakdown data.

### Current Behavior
- User enters: VSBE 9% in category breakdown
- Validation shows: "VSBE participation 0.00% is below required 10.0%"
- Expected: Should show: "VSBE participation 9.00% is below required 10.0%"

### Root Cause
1. Backend requires category_breakdown to sum to exactly 100%
2. When user enters partial percentages (e.g., 9% VSBE), frontend sends `null` instead
3. Backend validation ignores category_breakdown and only checks `counts_toward_mbe` flag
4. VSBE is not MBE, so it shows 0.00%

### What Needs to be Fixed (Backend)

## CRITICAL FIX NEEDED:

1. **Remove the 100% Sum Validation in Pydantic Model**
   - Location: The `BidSubcontractorCreate` or similar model that validates `category_breakdown`
   - Current: Validates that percentages must sum to 100%
   - Required: Remove this validation OR change it to allow any sum ≤ 100%
   - Example fix:
     ```python
     @field_validator('category_breakdown')
     def validate_breakdown(cls, v):
         if v:
             total = sum(item.percentage for item in v)
             if total > 100:
                 raise ValueError(f"Category breakdown percentages cannot exceed 100%, got {total}%")
             # Remove the check for total == 100
         return v
     ```

2. **Remove Invalid Category Validation**
   - Current: Backend rejects "Non-MBE" category
   - Options:
     - Remove the category whitelist check entirely
     - OR: Keep validation but allow percentages that don't sum to 100%

3. **Database Schema Update** (if not already done)
   - Add a `category_breakdown` JSONB field to the `bid_subcontractors` table to store breakdown data
   - Example structure: `[{"category": "MBE", "percentage": 50.0}, {"category": "WBE", "percentage": 30.0}]`

4. **API Endpoint Update** (`/bids/{bid_id}/subcontractors`)
   - Accept `category_breakdown` parameter in the request body
   - Store it in the database when creating/updating subcontractors

5. **Validation Rules Update - MOST IMPORTANT**
   - Update validation calculations in `jurisdiction_compliance` and `jurisdiction_specific_goals` rules
   - New logic:
     - For each subcontractor, check if `category_breakdown` exists
     - If yes: Calculate percentages based on breakdown categories (even if doesn't sum to 100%)
     - If no: Use the old logic (counts_toward_mbe flag)

   - Formula for each category:
     ```python
     # For each category (MBE, WBE, VSBE, SBE, etc.)
     for subcontractor in bid.subcontractors:
         if subcontractor.category_breakdown:
             for breakdown_item in subcontractor.category_breakdown:
                 category_contribution = (
                     (subcontractor.subcontract_value / bid.total_amount) *
                     (breakdown_item.percentage / 100) *
                     100
                 )
                 category_totals[breakdown_item.category] += category_contribution
         else:
             # Fallback to old logic
             if subcontractor.counts_toward_mbe:
                 mbe_total += (subcontractor.subcontract_value / bid.total_amount) * 100
     ```

   - Example with partial percentages:
     ```
     Bid Total: $100,000

     Subcontractor A: $10,000 with breakdown [{"category": "MBE", "percentage": 40}, {"category": "WBE", "percentage": 18}]
       - Total breakdown: 58% (remaining 42% is non-MBE)
       - MBE contribution: (10,000/100,000) * 0.40 * 100 = 4%
       - WBE contribution: (10,000/100,000) * 0.18 * 100 = 1.8%
       - Non-MBE (implicit): (10,000/100,000) * 0.42 * 100 = 4.2%

     Subcontractor B: $20,000 with breakdown [{"category": "VSBE", "percentage": 9}]
       - Total breakdown: 9% (remaining 91% is non-MBE)
       - VSBE contribution: (20,000/100,000) * 0.09 * 100 = 1.8%
       - Non-MBE (implicit): (20,000/100,000) * 0.91 * 100 = 18.2%

     FINAL TOTALS:
     - MBE: 4%
     - WBE: 1.8%
     - VSBE: 1.8%
     - Non-MBE: 22.4%
     ```

6. **Fallback Behavior**
   - If `category_breakdown` is null or empty for a subcontractor:
     - Use the old logic (counts_toward_mbe flag)
     - Assume 100% of subcontract value goes to MBE if `counts_toward_mbe` is true

### Validation Rules to Update
- `jurisdiction_compliance` rule for VSBE
- `jurisdiction_specific_goals` rule
- Any other rules checking MBE, WBE, SBE, VSBE percentages

---

## Issue 2: NAICS Code Validation Not Working

### Problem
Invalid NAICS codes (e.g., "11111") are passing validation when they should fail.

### What Needs to be Fixed (Backend)

1. **Add NAICS Code Validation**
   - Create a validator for NAICS codes
   - NAICS codes should be:
     - 2-6 digits long
     - Valid codes from the official NAICS classification system

2. **Options for Implementation**:

   **Option A: Basic Format Validation** (Quick Fix)
   ```python
   def validate_naics_format(naics_code: str) -> bool:
       # NAICS codes are 2-6 digits
       if not naics_code.isdigit():
           return False
       length = len(naics_code)
       return 2 <= length <= 6
   ```

   **Option B: Full NAICS Validation** (Recommended)
   - Maintain a database table of valid NAICS codes
   - Validate against this table
   - Update periodically from official NAICS data source
   - Example structure:
     ```sql
     CREATE TABLE naics_codes (
         code VARCHAR(6) PRIMARY KEY,
         title VARCHAR(255),
         description TEXT
     );
     ```

3. **Where to Apply Validation**
   - In the `BidSubcontractorCreateRequest` schema/model
   - Add validation error message: "Invalid NAICS code. NAICS codes must be 2-6 digits and represent a valid industry classification."

4. **Validation Rule Update**
   - Create or update a validation rule to check NAICS code validity
   - Rule name: "naics_code_validity"
   - Should be run as part of bid validation

---

## Frontend Changes Already Made

✅ **Fixed**: Category breakdown now properly sends to backend API via `category_breakdown` field
✅ **Fixed**: Category breakdown display in SubcontractorList now reads from backend data
✅ **Fixed**: MBE calculation NaN issue in BidDetailPage
✅ **Fixed**: Added client-side NAICS validation (2-6 digits)
✅ **Fixed**: TypeScript types updated to include `category_breakdown` field
✅ **Fixed**: Removed localStorage workaround - now using backend storage

---

## Migration Steps

**Note: Based on the debug output, it appears the backend already supports `category_breakdown` field. The frontend is now sending it correctly.**

If the database doesn't have the field yet:

1. **Database Migration** (if needed)
   ```sql
   ALTER TABLE bid_subcontractors
   ADD COLUMN category_breakdown JSONB;
   ```

2. **Update API Models** (if needed)
   ```python
   class BidSubcontractorCreate(BaseModel):
       subcontractor_id: str
       work_description: str
       naics_code: str
       subcontract_value: float
       counts_toward_mbe: bool
       category_breakdown: Optional[Dict[str, float]] = None  # Should already exist based on debug logs
   ```

3. **Frontend API Client** ✅ DONE
   - ✅ Updated `BidSubcontractorCreateRequest` type in `src/types/index.ts`
   - ✅ Updated SubcontractorForm to send `category_breakdown` in API request

---

## Testing Checklist

After backend changes:
- [ ] Add subcontractor with MBE 50%, WBE 50% breakdown - verify percentages in validation
- [ ] Add subcontractor with VSBE 100% breakdown - verify VSBE percentage shows correctly
- [ ] Add subcontractor with no breakdown - verify old behavior (counts_toward_mbe) still works
- [ ] Try invalid NAICS code "11111" - should fail validation
- [ ] Try valid NAICS code "236220" - should pass validation
- [ ] Verify percentage calculations are correct for multiple subcontractors with different breakdowns
