'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, truncateUrl } from '../lib/utils';

export default function Dashboard() {
    const router = useRouter();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [targetUrl, setTargetUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    // Delete confirmation modal state
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, code: '' });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/links');
            if (!response.ok) {
                setError('Failed to fetch links');
                return;
            }
            const data = await response.json();
            setLinks(data);
        } catch (err) {
            setError('Failed to fetch links');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);
        setFormSuccess(false);
        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUrl, customCode: customCode || undefined }),
            });
            const data = await response.json();
            if (!response.ok) {
                setFormError(data.error || 'Failed to create link');
                return;
            }
            setFormSuccess(true);
            setTargetUrl('');
            setCustomCode('');
            setShowAddForm(false);
            fetchLinks();
            setTimeout(() => setFormSuccess(false), 3000);
        } catch (err) {
            setFormError('Failed to create link');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredLinks = links.filter(
        (link) =>
            link.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            link.target_url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Delete handling
    const handleDeleteLink = async (code) => {
        console.log('handleDeleteLink called with code:', code);
        setDeleteConfirm({ show: true, code });
    };

    const confirmDeletion = async () => {
        const { code } = deleteConfirm;
        setDeleteConfirm({ show: false, code: '' });
        try {
            const response = await fetch(`/api/links/${code}`, { method: 'DELETE' });
            if (!response.ok) {
                alert('Failed to delete link');
                return;
            }
            await fetchLinks();
        } catch (err) {
            alert(`Failed to delete link: ${err.message}`);
        }
    };

    const cancelDeletion = () => {
        setDeleteConfirm({ show: false, code: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">🔗 TinyLink</h1>
                            <p className="text-white/70">Shorten URLs, track clicks, manage links</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {showAddForm ? '✕ Cancel' : '+ Add Link'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Success Message */}
                {formSuccess && (
                    <div className="mb-6 bg-green-500/20 border border-green-400/50 text-green-200 px-6 py-4 rounded-lg backdrop-blur-lg">
                        ✓ Link created successfully!
                    </div>
                )}

                {/* Add Link Form */}
                {showAddForm && (
                    <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Short Link</h2>
                        <form onSubmit={handleAddLink} className="space-y-6">
                            <div>
                                <label className="block text-white/80 font-semibold mb-2">
                                    Target URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={targetUrl}
                                    onChange={(e) => setTargetUrl(e.target.value)}
                                    placeholder="https://example.com/very/long/url"
                                    required
                                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 font-semibold mb-2">
                                    Custom Short Code (optional)
                                </label>
                                <input
                                    type="text"
                                    value={customCode}
                                    onChange={(e) => setCustomCode(e.target.value)}
                                    placeholder="mycode (6-8 alphanumeric characters)"
                                    pattern="[A-Za-z0-9]{6,8}"
                                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40"
                                />
                                <p className="text-white/50 text-sm mt-2">Leave empty to auto-generate a random code</p>
                            </div>
                            {formError && (
                                <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg">
                                    {formError}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {formLoading ? 'Creating...' : 'Create Short Link'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="🔍 Search by code or URL..."
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40"
                    />
                </div>

                {/* Links Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-white text-xl">Loading links...</div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-300">{error}</div>
                    ) : filteredLinks.length === 0 ? (
                        <div className="p-12 text-center text-white/60">
                            {searchQuery ? 'No links found matching your search' : 'No links yet. Create your first one!'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-white/80 font-semibold">Short Code</th>
                                        <th className="px-6 py-4 text-left text-white/80 font-semibold">Target URL</th>
                                        <th className="px-6 py-4 text-left text-white/80 font-semibold">Clicks</th>
                                        <th className="px-6 py-4 text-left text-white/80 font-semibold">Last Clicked</th>
                                        <th className="px-6 py-4 text-left text-white/80 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filteredLinks.map((link) => (
                                        <tr key={link.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4"><code className="text-purple-300 font-mono font-semibold bg-black/30 px-3 py-1 rounded">{link.code}</code></td>
                                            <td className="px-6 py-4"><a href={link.target_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" title={link.target_url}>{truncateUrl(link.target_url, 50)}</a></td>
                                            <td className="px-6 py-4"><span className="text-white font-semibold">{link.total_clicks}</span></td>
                                            <td className="px-6 py-4 text-white/70">{formatDate(link.last_clicked_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => router.push(`/code/${link.code}`)} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-3 py-1 rounded transition-colors border border-blue-400/30" title="View Stats">📊 Stats</button>
                                                    <button type="button" onClick={() => copyToClipboard(link.code)} className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-3 py-1 rounded transition-colors border border-purple-400/30" title="Copy Link">📋 Copy</button>
                                                    <button type="button" onClick={() => handleDeleteLink(link.code)} className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded transition-colors border border-red-400/30" title="Delete">🗑️ Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm.show && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
                            <p className="mb-4">Are you sure you want to delete the link "<strong>{deleteConfirm.code}</strong>"?</p>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={cancelDeletion} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
                                <button type="button" onClick={confirmDeletion} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-white/50">
                <p>TinyLink v1.0 - URL Shortener</p>
            </footer>
        </div>
    );
}
