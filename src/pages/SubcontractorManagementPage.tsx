import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subcontractorsApi, organizationsApi, directoryApi } from '../api/client';
import { Subcontractor, Organization, SubcontractorDirectory } from '../types';
import { ArrowLeft, Users, Edit2, Trash2, AlertCircle, CheckCircle, Search, Plus, X, Mail, Phone, CheckSquare } from 'lucide-react';

const SubcontractorManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orgFilter = searchParams.get('org');
  const opportunityId = searchParams.get('opportunity_id');

  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    legal_name: '',
    certification_number: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [mbeFilter, setMbeFilter] = useState<boolean | undefined>(undefined);

  // Add from Directory Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [directorySubcontractors, setDirectorySubcontractors] = useState<SubcontractorDirectory[]>([]);
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [selectedDirectorySub, setSelectedDirectorySub] = useState<SubcontractorDirectory | null>(null);

  useEffect(() => {
    loadData();
  }, [orgFilter]);

  const loadData = async () => {
    try {
      const [subsResponse, orgsResponse] = await Promise.all([
        subcontractorsApi.getAll(),
        organizationsApi.getAll(),
      ]);

      let filteredSubs = subsResponse.data;

      // Filter by organization if orgFilter is present
      if (orgFilter) {
        filteredSubs = subsResponse.data.filter(sub => sub.organization_id === orgFilter);
      }

      setSubcontractors(filteredSubs);
      setOrganizations(orgsResponse.data);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await subcontractorsApi.search(searchQuery || undefined, mbeFilter);
      let filteredSubs = response.data;

      // Apply organization filter if present
      if (orgFilter) {
        filteredSubs = response.data.filter(sub => sub.organization_id === orgFilter);
      }

      setSubcontractors(filteredSubs);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    setMbeFilter(undefined);
    setLoading(true);

    try {
      const response = await subcontractorsApi.getAll();
      let filteredSubs = response.data;

      // Apply organization filter if present
      if (orgFilter) {
        filteredSubs = response.data.filter(sub => sub.organization_id === orgFilter);
      }

      setSubcontractors(filteredSubs);
    } catch (err) {
      console.error('Failed to load subcontractors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await subcontractorsApi.getById(id);
      console.log('Subcontractor details:', response.data);
      
      const org = organizations.find(o => o.id === response.data.organization_id);
      
      alert(
        `Subcontractor Details:\n\n` +
        `Name: ${response.data.legal_name}\n` +
        `Organization: ${org?.name || 'Unknown'}\n` +
        `Certification #: ${response.data.certification_number || 'N/A'}\n` +
        `MBE Status: ${response.data.is_mbe ? 'Yes' : 'No'}\n` +
        `ID: ${response.data.id}`
      );
    } catch (err) {
      console.error('Failed to fetch subcontractor:', err);
      setError('Failed to fetch subcontractor details');
    }
  };

  const handleStartEdit = (sub: Subcontractor) => {
    setEditingId(sub.id);
    setEditForm({
      legal_name: sub.legal_name,
      certification_number: sub.certification_number || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ legal_name: '', certification_number: '' });
  };

  const handleUpdate = async (id: string) => {
    setError(null);
    setSuccess(null);

    try {
      await subcontractorsApi.update(id, editForm);
      setSuccess('Subcontractor updated successfully!');
      setEditingId(null);
      await loadData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update subcontractor');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await subcontractorsApi.delete(id);
      setSuccess('Subcontractor deleted successfully!');
      await loadData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete subcontractor');
    }
  };

  const getOrganizationName = (orgId: string) => {
    return organizations.find(o => o.id === orgId)?.name || 'Unknown';
  };

  const handleOpenAddModal = async () => {
    setShowAddModal(true);
    setDirectoryLoading(true);
    try {
      const response = await directoryApi.getAll(0, 100);
      setDirectorySubcontractors(response.data);
    } catch (err) {
      console.error('Failed to load directory:', err);
      setError('Failed to load directory');
    } finally {
      setDirectoryLoading(false);
    }
  };

  const handleDirectorySearch = async () => {
    setDirectoryLoading(true);
    try {
      const response = await directoryApi.simpleSearch({ q: directorySearchQuery });
      setDirectorySubcontractors(response.data);
    } catch (err) {
      console.error('Directory search failed:', err);
      setError('Directory search failed');
    } finally {
      setDirectoryLoading(false);
    }
  };

  const handleAddFromDirectory = async () => {
    if (!selectedDirectorySub || !orgFilter) return;

    try {
      // Create a new subcontractor in the organization's network based on directory data
      await subcontractorsApi.create({
        organization_id: orgFilter,
        legal_name: selectedDirectorySub.legal_name,
        certification_number: selectedDirectorySub.federal_id || undefined,
        is_mbe: selectedDirectorySub.certifications?.mbe || false,
      });

      setSuccess(`Added ${selectedDirectorySub.legal_name} to your network!`);
      setShowAddModal(false);
      setSelectedDirectorySub(null);
      setDirectorySearchQuery('');
      await loadData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add subcontractor to network');
    }
  };

  if (loading && subcontractors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate(opportunityId ? `/assessment/${opportunityId}` : '/opportunities')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {orgFilter ? 'Network' : 'Subcontractor Management'}
          </h1>
          <p className="text-gray-600">
            {orgFilter
              ? `Subcontractors for ${organizations.find(o => o.id === orgFilter)?.name || 'selected organization'}`
              : 'View, edit, and delete subcontractors'}
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Add from Directory Button - Only show when viewing network */}
        {orgFilter && (
          <div className="mb-6">
            <button
              onClick={handleOpenAddModal}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add from Directory
            </button>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Search Subcontractors</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by name or certification
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter search term..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MBE Filter
              </label>
              <select
                value={mbeFilter === undefined ? 'all' : mbeFilter ? 'true' : 'false'}
                onChange={(e) => {
                  const val = e.target.value;
                  setMbeFilter(val === 'all' ? undefined : val === 'true');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="true">MBE Only</option>
                <option value="false">Non-MBE Only</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Subcontractors List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Subcontractors ({subcontractors.length})
            </h2>
          </div>

          {subcontractors.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>No subcontractors found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {subcontractors.map((sub) => (
                <div key={sub.id} className="p-6 hover:bg-gray-50 transition-colors">
                  {editingId === sub.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Legal Name
                        </label>
                        <input
                          type="text"
                          value={editForm.legal_name}
                          onChange={(e) => setEditForm({ ...editForm, legal_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Certification Number
                        </label>
                        <input
                          type="text"
                          value={editForm.certification_number}
                          onChange={(e) => setEditForm({ ...editForm, certification_number: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(sub.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{sub.legal_name}</h3>
                          {sub.is_mbe && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              MBE
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Organization:</strong> {getOrganizationName(sub.organization_id)}
                          </p>
                          <p>
                            <strong>Certification:</strong> {sub.certification_number || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-400">ID: {sub.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(sub.id)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleStartEdit(sub)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id, sub.legal_name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add from Directory Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add from Directory</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDirectorySub(null);
                    setDirectorySearchQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={directorySearchQuery}
                    onChange={(e) => setDirectorySearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleDirectorySearch()}
                    placeholder="Search by name, jurisdiction, or capabilities..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleDirectorySearch}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                </div>
              </div>

              {/* Directory List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {directoryLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : directorySubcontractors.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>No subcontractors found in the directory.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {directorySubcontractors.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedDirectorySub(sub)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedDirectorySub?.id === sub.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{sub.legal_name}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {sub.certifications?.mbe && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                  MBE
                                </span>
                              )}
                              {sub.certifications?.vsbe && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                                  VSBE
                                </span>
                              )}
                              {sub.certifications?.dbe && (
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                                  DBE
                                </span>
                              )}
                              {sub.is_verified && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded flex items-center gap-1">
                                  <CheckSquare className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600 mb-2">
                              {sub.contact_email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {sub.contact_email}
                                </div>
                              )}
                              {sub.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {sub.phone}
                                </div>
                              )}
                            </div>
                            {sub.capabilities && (
                              <p className="text-sm text-gray-600">
                                <strong>Capabilities:</strong> {sub.capabilities}
                              </p>
                            )}
                            {sub.contractors_using_count > 0 && (
                              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <Users className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-semibold text-emerald-800">
                                  {sub.contractors_using_count} contractor{sub.contractors_using_count !== 1 ? 's' : ''} trust this subcontractor
                                </span>
                              </div>
                            )}
                          </div>
                          {selectedDirectorySub?.id === sub.id && (
                            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDirectorySub(null);
                    setDirectorySearchQuery('');
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFromDirectory}
                  disabled={!selectedDirectorySub}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add to Network
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcontractorManagementPage;