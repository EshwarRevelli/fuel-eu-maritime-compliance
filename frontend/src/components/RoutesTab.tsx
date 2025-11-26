import { useEffect, useState } from 'react';
import { RouteServicePort } from '../core/ports/RoutePort';
import { Route } from '../core/domain/Route';

interface RoutesTabProps {
  routeService: RouteServicePort;
}

export default function RoutesTab({ routeService }: RoutesTabProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    vesselType: '',
    fuelType: '',
    year: '',
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await routeService.getAllRoutes();
      setRoutes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (routeId: string) => {
    try {
      await routeService.setBaseline(routeId);
      await loadRoutes();
    } catch (err: any) {
      setError(err.message || 'Failed to set baseline');
    }
  };

  const filteredRoutes = routes.filter((route) => {
    if (filters.vesselType && route.vesselType !== filters.vesselType) return false;
    if (filters.fuelType && route.fuelType !== filters.fuelType) return false;
    if (filters.year && route.year.toString() !== filters.year) return false;
    return true;
  });

  const uniqueVesselTypes = [...new Set(routes.map((r) => r.vesselType))];
  const uniqueFuelTypes = [...new Set(routes.map((r) => r.fuelType))];
  const uniqueYears = [...new Set(routes.map((r) => r.year.toString()))].sort();

  if (loading) {
    return <div className="text-center py-8">Loading routes...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex gap-4 flex-wrap">
        <select
          value={filters.vesselType}
          onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Vessel Types</option>
          {uniqueVesselTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.fuelType}
          onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Fuel Types</option>
          {uniqueFuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vessel Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuel Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GHG Intensity (gCO₂e/MJ)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuel Consumption (t)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance (km)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Emissions (t)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRoutes.map((route) => (
              <tr key={route.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.routeId}
                  {route.isBaseline && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Baseline
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.vesselType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.fuelType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.ghgIntensity.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.fuelConsumption.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.distance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.totalEmissions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {!route.isBaseline && (
                    <button
                      onClick={() => handleSetBaseline(route.routeId)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Set Baseline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



