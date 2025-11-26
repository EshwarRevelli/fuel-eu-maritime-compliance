import { useEffect, useState } from 'react';
import { BankingServicePort } from '../core/ports/BankingPort';
import { ComplianceServicePort } from '../core/ports/CompliancePort';
import { BankingResult } from '../core/domain/Banking';

interface BankingTabProps {
  bankingService: BankingServicePort;
  complianceService: ComplianceServicePort;
}

export default function BankingTab({ bankingService, complianceService }: BankingTabProps) {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<number | null>(null);
  const [bankAmount, setBankAmount] = useState('');
  const [applyAmount, setApplyAmount] = useState('');
  const [result, setResult] = useState<BankingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComplianceBalance();
  }, [shipId, year]);

  const loadComplianceBalance = async () => {
    try {
      setLoading(true);
      const balance = await complianceService.getComplianceBalance(shipId, year);
      setCb(balance.cbGco2eq);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load compliance balance');
      setCb(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    try {
      setLoading(true);
      setError(null);
      await bankingService.bankSurplus(shipId, year, parseFloat(bankAmount));
      setBankAmount('');
      await loadComplianceBalance();
    } catch (err: any) {
      setError(err.message || 'Failed to bank surplus');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await bankingService.applyBanked(shipId, year, parseFloat(applyAmount));
      setResult(result);
      setApplyAmount('');
      await loadComplianceBalance();
    } catch (err: any) {
      setError(err.message || 'Failed to apply banked surplus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Compliance Balance</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ship ID</label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {cb !== null && (
          <div className={`p-4 rounded ${cb > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm font-medium text-gray-700">Current Compliance Balance</div>
            <div className={`text-2xl font-bold ${cb > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cb.toFixed(2)} gCO₂e
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {cb > 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Banking Result</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">CB Before</div>
              <div className="text-xl font-semibold">{result.cbBefore.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Applied</div>
              <div className="text-xl font-semibold">{result.applied.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">CB After</div>
              <div className="text-xl font-semibold">{result.cbAfter.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Bank Surplus</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (gCO₂e)</label>
          <input
            type="number"
            value={bankAmount}
            onChange={(e) => setBankAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter amount to bank"
          />
        </div>
        <button
          onClick={handleBank}
          disabled={!bankAmount || cb === null || cb <= 0 || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Bank Surplus
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Apply Banked Surplus</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (gCO₂e)</label>
          <input
            type="number"
            value={applyAmount}
            onChange={(e) => setApplyAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter amount to apply"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!applyAmount || cb === null || loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Apply Banked
        </button>
      </div>
    </div>
  );
}



