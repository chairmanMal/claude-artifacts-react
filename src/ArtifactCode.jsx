import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#FF9F43', '#1ABC9C',
  '#D35400', '#8E44AD', '#2980B9', '#F1C40F', '#16A085'
];

const DonationAnalysisApp = () => {
  const data = {
    "Chris": {
      "Food Security": 30.0,
      "Arts & Culture": 18.0,
      "Education": 8.6,
      "Animal Welfare": 7.3,
      "Disaster Relief": 7.1,
      "Environmental Programs": 2.3,
      "Women's Rights": 1.4,
      "Children & Family": 1.4,
      "Health": 0.7,
      "Other Support Services": 23.2
    },
    "Melody": {
      "Children & Family": 12.5,
      "Housing": 16.1,
      "Veterans": 9.3,
      "Disaster Relief": 7.1,
      "Animal Welfare": 6.1,
      "Education": 5.7,
      "Food Security": 4.3,
      "Health": 2.9,
      "Women's Rights": 2.9,
      "Community Services": 33.1
    },
    "R & H": {
      "Environment": 20.7,
      "Human Rights": 10.7,
      "Women's Rights": 11.1,
      "Arts & Culture": 5.0,
      "Animal Welfare": 5.4,
      "Education": 3.6,
      "Food Security": 3.9,
      "Health": 3.6,
      "Children & Family": 2.9,
      "Community Development": 33.1
    },
    "S & J": {
      "Environment": 21.4,
      "Animal Welfare": 10.7,
      "Health": 12.9,
      "Human Rights": 8.6,
      "Children & Family": 12.9,
      "Women's Rights": 8.6,
      "Arts & Culture": 5.7,
      "Community Services": 19.2
    },
    "P & O": {
      "Housing": 16.1,
      "Education": 18.6,
      "Human Rights": 21.1,
      "Environment": 5.4,
      "Animal Welfare": 0.7,
      "Women's Rights": 5.0,
      "Disaster Relief": 3.6,
      "Arts & Culture": 1.1,
      "Local Initiatives": 28.4
    }
  };

  const downloadAsImage = (donor) => {
    const chartContainer = document.getElementById(`chart-${donor}`);
    if (!chartContainer) return;

    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = svgElement.width.baseVal.value;
    canvas.height = svgElement.height.baseVal.value;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svg);

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${donor.toLowerCase().replace(/ /g, '_')}_donations.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.8);
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadSummary = (donor, donorData) => {
    const summaryText = Object.entries(donorData)
      .sort(([,a], [,b]) => b - a)
      .map(([category, percentage]) => `${category}: ${percentage.toFixed(1)}%`)
      .join('\n');
    
    const blob = new Blob(
      [`${donor}'s Donation Summary\n\n${summaryText}`], 
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${donor.toLowerCase().replace(/ /g, '_')}_summary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderPieChart = (donor, donorData) => {
    const chartData = Object.entries(donorData).map(([name, value]) => ({
      name,
      value: parseFloat(value)
    })).sort((a, b) => b.value - a.value);

    return (
      <Card key={donor} className="mb-8 bg-white shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{donor}'s Donation Distribution</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => downloadAsImage(donor)}
              >
                <Download className="h-4 w-4" />
                Save Chart
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => downloadSummary(donor, donorData)}
              >
                <Download className="h-4 w-4" />
                Save Summary
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div id={`chart-${donor}`} className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  labelLine={true}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value.toFixed(2)}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Foundation 2024 Donation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Interactive visualization of charitable donations. Use the buttons to 
              download charts as images or get detailed summaries as text files.
            </p>
          </CardContent>
        </Card>
        <div className="max-w-4xl mx-auto">
          {Object.entries(data).map(([donor, donorData]) => 
            renderPieChart(donor, donorData)
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationAnalysisApp;
