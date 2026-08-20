import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type CountdownTimerProps = {
  initialTime?: number;
  onResend?: () => void;
};

export default function CountdownTimer({
  initialTime = 70,
  onResend,
}: CountdownTimerProps) {

  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {

    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);

  const handleResend = () => {
    setTimeLeft(initialTime);
    onResend?.();
  };

  return (
    <View>

      <View style={styles.timerRow}>

        <Text style={styles.timerText}>
          Auto Verification is enabled
        </Text>

        <Text style={styles.time}>
          {timeLeft} Sec
        </Text>

      </View>

      {timeLeft === 0 && (
        <TouchableOpacity
          onPress={handleResend}
        >
          <Text style={styles.resend}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  timerRow: {
    marginTop: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerText: {
    fontSize: 15,
    color: '#444',
    marginRight: 8,
  },

  time: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C9C57',
  },

  resend: {
    marginTop: 18,
    textAlign: 'center',
    color: '#1C9C57',
    fontWeight: '700',
    fontSize: 15,
  },

});