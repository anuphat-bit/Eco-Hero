import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { PAPER_SAVING_TIPS } from '../constants';

const TipOfTheDay: React.FC = () => {
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    // Select a random tip when the component mounts
    const randomIndex = Math.floor(Math.random() * PAPER_SAVING_TIPS.length);
    setTip(PAPER_SAVING_TIPS[randomIndex]);
  }, []);

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-md font-bold text-yellow-800">เคล็ดลับประจำวัน</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipOfTheDay;
