import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Mon Profil',
      icon: 'person-outline',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      id: 2,
      title: 'Paramètres',
      icon: 'settings-outline',
      onPress: () => Alert.alert('Paramètres', 'Fonctionnalité à venir'),
    },
    {
      id: 3,
      title: 'Aide & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Contact'),
    },
    {
      id: 4,
      title: 'À Propos',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('About'),
    },
    {
      id: 5,
      title: 'Déconnexion',
      icon: 'log-out-outline',
      onPress: handleLogout,
      destructive: true,
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={item.destructive ? theme.colors.error : theme.colors.primary} 
        />
        <Text style={[
          styles.menuItemTitle, 
          { 
            color: item.destructive ? theme.colors.error : theme.colors.text 
          }
        ]}>
          {item.title}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user ? user.name || 'Utilisateur' : 'Utilisateur'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
              {user ? user.email : 'email@example.com'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map(renderMenuItem)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default ProfileScreen;
