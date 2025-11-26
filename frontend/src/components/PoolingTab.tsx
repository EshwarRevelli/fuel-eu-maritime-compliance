import { useEffect, useState } from 'react';
import { PoolingServicePort } from '../core/ports/PoolingPort';
import { ComplianceServicePort } from '../core/ports/CompliancePort';
import { CreatePoolResult } from '../core/domain/Pooling';

interface PoolingTabProps {
  poolingService: PoolingServicePort;
  complianceService: ComplianceServicePort;
}

interface PoolMemberInput {
  shipId: string;
  cbBefore: number;
}

export default function PoolingTab({ poolingService, complianceService }: PoolingTabProps) {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState<PoolMemberInput[]>([]);
  const [newShipId, setNewShipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreatePoolResult | null>(null);

  const loadMemberCb = async (shipId: string) => {
    try {
      const adjusted = await complianceService.getAdjustedComplianceBalance(shipId, year);
      return adjusted.adjustedCbGco2eq;
    } catch (err: any) {
      throw new Error(`Failed to load CB for ${shipId}: ${err.message}`);
    }
  };

  const handleAddMember = async () => {
    if (!newShipId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const cbBefore = await loadMemberCb(newShipId);
      setMembers([...members, { shipId: newShipId, cbBefore }]);
      setNewShipId('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreatePool = async () => {
    try {
      setLoading(true);
      setError(null);
      const poolResult = await poolingService.createPool(year, members);
      setResult(poolResult);
    } catch (err: any) {
      setError(err.message || 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  const totalCb = members.reduce((sum, m) => sum + m.cbBefore, 0);
  const isValid = totalCb >= 0 && members.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create Pool</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              setYear(parseInt(e.target.value));
              setMembers([]);
              setResult(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Ship</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newShipId}
              onChange={(e) => setNewShipId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Ship ID (e.g., R001)"
            />
            <button
              onClick={handleAddMember}
              disabled={loading || !newShipId.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {members.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Pool Members</h3>
          <div className="mb-4">
            <div className={`p-3 rounded ${totalCb >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-sm font-medium text-gray-700">Pool Sum</div>
              <div className={`text-xl font-bold ${totalCb >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalCb.toFixed(2)} gCO₂e
              </div>
              {totalCb < 0 && (
                <div className="text-xs text-red-600 mt-1">
                  Pool sum must be ≥ 0 to create pool
                </div>
              )}
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ship ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB Before</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.shipId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.cbBefore.toFixed(2)} gCO₂e
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleRemoveMember(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleCreatePool}
            disabled={!isValid || loading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create Pool
          </button>
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Pool Created Successfully</h3>
          <div className="text-sm text-gray-600 mb-4">Pool ID: {result.poolId}</div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ship ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB Before</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB After</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.members.map((member, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.shipId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.cbBefore.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.cbAfter.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        member.cbAfter > member.cbBefore
                          ? 'text-green-600'
                          : member.cbAfter < member.cbBefore
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }
                    >
                      {member.cbAfter > member.cbBefore ? '+' : ''}
                      {(member.cbAfter - member.cbBefore).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



