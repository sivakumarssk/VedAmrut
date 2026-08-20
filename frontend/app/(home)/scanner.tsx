import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/common/ScreenHeader';

const { width } = Dimensions.get('window');
const FRAME_SIZE = width - 64;

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Alert.alert('QR Code Scanned', data, [
      { text: 'OK', onPress: () => setScanned(false) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Scan product any QR"
        titleStyle={styles.title}
        iconColor="#FFFFFF"
      />

      <Text style={styles.subtitle}>Unlock 5% cashback offers</Text>

      <View style={styles.frameWrapper}>
        {permission?.granted ? (
          <CameraView
            style={styles.camera}
            facing="back"
            enableTorch={torchOn}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />
        ) : (
          <TouchableOpacity
            style={styles.permissionPrompt}
            onPress={requestPermission}
          >
            <Ionicons name="camera-outline" size={40} color="#B5B5B5" />
            <Text style={styles.permissionText}>
              Tap to allow camera access
            </Text>
          </TouchableOpacity>
        )}

        <View pointerEvents="none" style={styles.cornerOverlay}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setTorchOn((prev) => !prev)}
        >
          <View
            style={[
              styles.actionCircle,
              torchOn && styles.actionCircleActive,
            ]}
          >
            <Ionicons name="flashlight-outline" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.actionLabel}>Torch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CORNER_SIZE = 32;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginRight: 40,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 32,
    marginBottom: 32,
  },
  frameWrapper: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
  },
  camera: {
    flex: 1,
  },
  permissionPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    marginTop: 12,
    color: '#B5B5B5',
    fontSize: 14,
  },
  cornerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#9B4DFF',
  },
  cornerTopLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: 20,
    right: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  actionItem: {
    alignItems: 'center',
    marginHorizontal: 28,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCircleActive: {
    backgroundColor: '#9B4DFF',
  },
  actionLabel: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
