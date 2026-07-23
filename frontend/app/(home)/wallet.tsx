import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../src/components/common/ScreenHeader';

const transactions = [
  {
    id: 't1',
    name: 'Tulsi Drops 30ml',
    image: require('../../src/assets/images/TulsiDrops.png'),
    scannedOn: 'Scanned on 24 May 2025, 10:30 AM',
    points: 20,
  },
  {
    id: 't2',
    name: 'Neem Capsules 60 Tabs',
    image: require('../../src/assets/images/NeemCapsules.png'),
    scannedOn: 'Scanned on 23 May 2025, 10:30 AM',
    points: 10,
  },
  {
    id: 't3',
    name: 'Amla Juice 500ml',
    image: require('../../src/assets/images/HerbalJuices.png'),
    scannedOn: 'Scanned on 22 May 2025, 11:30 AM',
    points: 15,
  },
  {
    id: 't4',
    name: 'Neem Capsules 60 Tabs',
    image: require('../../src/assets/images/NeemCapsules.png'),
    scannedOn: 'Scanned on 23 May 2025, 10:30 AM',
    points: 10,
  },
  {
    id: 't5',
    name: 'Amla Juice 500ml',
    image: require('../../src/assets/images/HerbalJuices.png'),
    scannedOn: 'Scanned on 22 May 2025, 11:30 AM',
    points: 15,
  },
];

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="My Wallet" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Total Wallet Balance</Text>
            <Text style={styles.balanceValue}>₹150.00</Text>
          </View>
          <Image
            source={require('../../src/assets/images/wallet.png')}
            style={styles.balanceImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rewardsRow}>
          <View style={styles.rewardsIcon}>
            <Ionicons name="gift" size={22} color="#1C9C57" />
          </View>

          <View style={styles.rewardsInfo}>
            <Text style={styles.rewardsLabel}>Rewards Points</Text>
            <Text style={styles.rewardsValue}>₹150.00</Text>
            <Text style={styles.rewardsSubtitle}>Earned from Scans</Text>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Recent Transitions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsCard}>
          {transactions.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.transactionRow,
                index !== transactions.length - 1 &&
                  styles.transactionRowBorder,
              ]}
            >
              <View style={styles.transactionIcon}>
                <Image
                  source={item.image}
                  style={styles.transactionImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{item.name}</Text>
                <Text style={styles.transactionDate}>{item.scannedOn}</Text>
              </View>

              <View style={styles.pointsRow}>
                <Text style={styles.pointsText}>+{item.points} Points</Text>
                <Ionicons name="chevron-forward" size={16} color="#1C9C57" />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E7F3EA',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 15,
    color: '#333',
  },
  balanceValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 6,
  },
  balanceImage: {
    width: 130,
    height: 110,
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  rewardsIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#DCF2E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardsInfo: {
    flex: 1,
  },
  rewardsLabel: {
    fontSize: 15,
    color: '#333',
  },
  rewardsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  rewardsSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C9C57',
  },
  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  transactionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E7F3EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionImage: {
    width: 30,
    height: 30,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C9C57',
    marginRight: 2,
  },
});
