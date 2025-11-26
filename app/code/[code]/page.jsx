'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDate } from '../../../lib/utils';


export default function StatsPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code;

    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchLinkStats();
    }, [code]);

    const fetchLinkStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/links/${code}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError('Link not found');
                } else {
                    setError('Failed to fetch link stats');
                }
                return;
            }

            const data = await response.json();
            setLink(data);
        } catch (err) {
            setError('Failed to fetch link stats');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getShortUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/${code}`;
        }
        return '';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error || !link) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4">
                    <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
                    <p className="text-red-300 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-white">Link Statistics</h1>
                        <button
                            onClick={() => router.push('/')}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Short Code */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h2 className="text-sm font-semibold text-white/60 mb-2">Short Code</h2>
                            <div className="flex items-center gap-3">
                                <code className="text-2xl font-mono text-white bg-black/30 px-4 py-2 rounded-lg">
                                    {link.code}
                                </code>
                            </div>
                        </div>

                        {/* Short URL */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h2 className="text-sm font-semibold text-white/60 mb-2">Short URL</h2>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={getShortUrl()}
                                    readOnly
                                    className="flex-1 bg-black/30 text-white px-4 py-3 rounded-lg font-mono"
                                />
                                <button
                                    onClick={() => copyToClipboard(getShortUrl())}
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
                                >
                                    {copied ? '✓ Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Target URL */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h2 className="text-sm font-semibold text-white/60 mb-2">Target URL</h2>
                            <a
                                href={link.target_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-blue-200 break-all underline"
                            >
                                {link.target_url}
                            </a>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-400/30">
                                <h3 className="text-sm font-semibold text-purple-200 mb-2">Total Clicks</h3>
                                <p className="text-4xl font-bold text-white">{link.total_clicks}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30">
                                <h3 className="text-sm font-semibold text-blue-200 mb-2">Created</h3>
                                <p className="text-lg font-semibold text-white">{formatDate(link.created_at)}</p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl p-6 border border-indigo-400/30">
                                <h3 className="text-sm font-semibold text-indigo-200 mb-2">Last Clicked</h3>
                                <p className="text-lg font-semibold text-white">{formatDate(link.last_clicked_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
