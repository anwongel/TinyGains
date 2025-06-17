import { useState } from 'react';
import tinygainsLogo from './tinygains.png';

export default function TinyGains() {
  // State
  const [inputs, setInputs] = useState({
    accountBalance: '',
    riskPercentage: '',
    leverage: '',
    stopLossPercentage: '',
    riskRewardRatio: ''
  });
  const [error, setError] = useState('');
  const [results, setResults] = useState({
    margin: '',
    potentialLoss: '',
    potentialProfit: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  // Calculate position sizing
  const calculate = () => {
    const emptyFields = Object.entries(inputs).filter(([_, value]) => !value.trim());
    setInvalidFields(emptyFields.map(([key]) => key));

    if (emptyFields.length > 0) {
      setError('Please fill all fields');
      return;
    }

    try {
      const values = {
        accountBalance: parseFloat(inputs.accountBalance),
        riskPercentage: parseFloat(inputs.riskPercentage),
        leverage: parseFloat(inputs.leverage),
        stopLossPercentage: parseFloat(inputs.stopLossPercentage),
        riskRewardRatio: parseFloat(inputs.riskRewardRatio),
      };

      // Validation
      if (values.riskPercentage > 100 || values.stopLossPercentage > 100) {
        setError('Risk and Stop Loss percentages must be ≤ 100');
        return;
      }
      if (Object.values(values).some(val => val <= 0)) {
        setError('All inputs must be positive numbers');
        return;
      }

      // Calculations
      const riskAmount = values.accountBalance * (values.riskPercentage / 100);
      const positionSize = riskAmount / (values.stopLossPercentage / 100);
      const margin = positionSize / values.leverage;

      setResults({
        margin: `$${margin.toFixed(2)}`,
        potentialLoss: `$${riskAmount.toFixed(2)}`,
        potentialProfit: `$${(riskAmount * values.riskRewardRatio).toFixed(2)}`,
      });
      setShowResults(true);
      setError('');
    } catch (err) {
      setError('Invalid input values');
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const validatedValue = value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1')
      .replace(/^0+(\d)/, '$1');
    setInputs(prev => ({ ...prev, [id]: validatedValue }));
    setError('');
    setShowResults(false);
    setInvalidFields(prev => prev.filter(field => field !== id));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const numValue = parseFloat(value);
    const isValid = !isNaN(numValue) && numValue > 0 && 
                   (!['riskPercentage', 'stopLossPercentage'].includes(id) || 
                   (numValue <= 100));
    
    setInvalidFields(prev => 
      isValid 
        ? prev.filter(field => field !== id) 
        : [...prev.filter(field => field !== id), id]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Banner */}
        <div className="bg-secondary text-primary-foreground text-center py-3 rounded-md mb-6 text-sm">
          🚀 Join our trading community: {' '}
          <a href="https://discord.gg/JUYRjkC3" target="_blank" rel="noopener noreferrer" className="underline">
            Discord
          </a>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <img 
    src={tinygainsLogo} 
    alt="TinyGains Logo" 
    className="h-14 w-auto"
  />
          <a href="/support" className="text-primary hover:underline text-base bg-black text-white px-4 py-2 rounded-md">Support</a>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 leading-10">
            Trading doesn't have to be complicated. <br />
            But it does have to be <span className="text-primary">smart.</span>
          </h1>
          <p className="text-muted-foreground muted">
            A real, no-BS trading tool — because guessing isn't a strategy.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
          <div className="space-y-6">
            {/* Account Balance */}
            <div>
              <label htmlFor="accountBalance" className="block text-sm font-medium mb-2">
                Account Balance ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="text"
                  id="accountBalance"
                  placeholder="Enter account balance"
                  value={inputs.accountBalance}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className={`flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    invalidFields.includes('accountBalance') ? 'border-destructive ring-2 ring-destructive' : ''
                  }`}
                />
              </div>
            </div>

            {/* Risk % and Leverage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="riskPercentage" className="block text-sm font-medium mb-2">
                  Risk Per Trade (%)
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  <input
                    type="text"
                    id="riskPercentage"
                    placeholder="Enter risk percentage"
                    value={inputs.riskPercentage}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      invalidFields.includes('riskPercentage') ? 'border-destructive ring-2 ring-destructive' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="leverage" className="block text-sm font-medium mb-2">
                  Leverage
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">x</span>
                  <input
                    type="text"
                    id="leverage"
                    placeholder="Enter leverage"
                    value={inputs.leverage}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      invalidFields.includes('leverage') ? 'border-destructive ring-2 ring-destructive' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Stop Loss % and Risk Reward */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stopLossPercentage" className="block text-sm font-medium mb-2">
                  Stop Loss (%)
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  <input
                    type="text"
                    id="stopLossPercentage"
                    placeholder="Enter stop-loss percentage"
                    value={inputs.stopLossPercentage}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      invalidFields.includes('stopLossPercentage') ? 'border-destructive ring-2 ring-destructive' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="riskRewardRatio" className="block text-sm font-medium mb-2">
                  Risk Reward Ratio
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">R:R</span>
                  <input
                    type="text"
                    id="riskRewardRatio"
                    placeholder="Enter risk reward ratio"
                    value={inputs.riskRewardRatio}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      invalidFields.includes('riskRewardRatio') ? 'border-destructive ring-2 ring-destructive' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            {/* Calculate Button */}
            <button
              onClick={calculate}
              className="border inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-primary/90 h-12 px-6 py-3 w-full"
            >
              Calculate
            </button>

            {/* Results */}
            {showResults && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 bg-muted">
                <h4 className="font-semibold mb-3">Results:</h4>
                <div className="space-y-2">
                  <p>Margin: {results.margin}</p>
                  <p>Potential Loss: {results.potentialLoss}</p>
                  <p>Potential Profit: {results.potentialProfit}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left text-sm text-muted-foreground">
  <div>
    <h5 className="font-semibold mb-2 text-sm">TinyGains</h5>
    <p className="text-muted-foreground muted">© {new Date().getFullYear()}</p>
  </div>
  <div>
    <h5 className="font-semibold mb-2 text-sm">About</h5>
    <p className="text-muted-foreground muted">
      Design and code by <a href="https://ko-fi.com/anwongel" target="_blank" rel="noopener noreferrer" className="text-primary underline">Angel</a>
    </p>
  </div>
  <div>
    <h5 className="font-semibold mb-2 text-sm">Feedback</h5>
    <p className="text-muted-foreground muted">
      Tell me what you <a href="https://discord.gg/JUYRjkC3" target="_blank" rel="noopener noreferrer" className="text-primary underline">want to see</a>
    </p>
  </div>
</div>
      </div>
    </div>
  );
}