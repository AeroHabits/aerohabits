
import React from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
    return strength;
  };

  const strengthLabels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  const strength = getStrength(password);

  return (
    <div className="mt-2">
      <div className="flex space-x-1 h-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className={`flex-1 rounded-full ${
              index < strength ? strengthColors[strength - 1] : 'bg-gray-300'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      {password && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs mt-1 ${strengthColors[strength - 1]}`}
        >
          {strengthLabels[strength - 1]} Password
        </motion.p>
      )}
    </div>
  );
};
