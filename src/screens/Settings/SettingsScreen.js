import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

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
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Apparence',
      items: [
        {
          id: 'theme',
          title: 'Mode sombre',
          subtitle: 'Activer le thème sombre',
          type: 'switch',
          value: theme.dark,
          onPress: toggleTheme,
          icon: 'moon',
        },
        {
          id: 'language',
          title: 'Langue',
          subtitle: 'Français',
          type: 'navigate',
          onPress: () => navigation.navigate('LanguageSettings'),
          icon: 'language',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Notifications push',
          subtitle: 'Recevoir des notifications',
          type: 'switch',
          value: notifications,
          onPress: () => setNotifications(!notifications),
          icon: 'notifications',
        },
        {
          id: 'email_notifications',
          title: 'Notifications email',
          subtitle: 'Recevoir des emails',
          type: 'switch',
          value: true,
          onPress: () => {},
          icon: 'mail',
        },
      ],
    },
    {
      title: 'Sécurité',
      items: [
        {
          id: 'biometric',
          title: 'Authentification biométrique',
          subtitle: 'Utiliser l\'empreinte digitale',
          type: 'switch',
          value: biometricAuth,
          onPress: () => setBiometricAuth(!biometricAuth),
          icon: 'finger-print',
        },
        {
          id: 'change_password',
          title: 'Changer le mot de passe',
          subtitle: 'Modifier votre mot de passe',
          type: 'navigate',
          onPress: () => navigation.navigate('ChangePassword'),
          icon: 'lock-closed',
        },
      ],
    },
    {
      title: 'Données',
      items: [
        {
          id: 'auto_sync',
          title: 'Synchronisation automatique',
          subtitle: 'Synchroniser les données',
          type: 'switch',
          value: autoSync,
          onPress: () => setAutoSync(!autoSync),
          icon: 'sync',
        },
        {
          id: 'export_data',
          title: 'Exporter les données',
          subtitle: 'Télécharger vos données',
          type: 'navigate',
          onPress: () => navigation.navigate('ExportData'),
          icon: 'download',
        },
        {
          id: 'clear_cache',
          title: 'Vider le cache',
          subtitle: 'Libérer de l\'espace',
          type: 'action',
          onPress: () => Alert.alert('Cache vidé', 'Le cache a été vidé avec succès.'),
          icon: 'trash',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Aide et support',
          subtitle: 'Consulter l\'aide',
          type: 'navigate',
          onPress: () => navigation.navigate('Help'),
          icon: 'help-circle',
        },
        {
          id: 'feedback',
          title: 'Envoyer un feedback',
          subtitle: 'Partager votre avis',
          type: 'navigate',
          onPress: () => navigation.navigate('Feedback'),
          icon: 'chatbubble',
        },
        {
          id: 'about',
          title: 'À propos',
          subtitle: 'Version 1.0.0',
          type: 'navigate',
          onPress: () => navigation.navigate('About'),
          icon: 'information-circle',
        },
      ],
    },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={item.onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name={item.icon} size={20} color="white" />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
            {item.subtitle}
          </Text>
        </View>
      </View>
      
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={item.value ? '#f4f3f4' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paramètres</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      {/* User Profile */}
      <View style={[styles.profileSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.profileInfo}>
          <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="person" size={32} color="white" />
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>
              {user?.name || 'Utilisateur'}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Settings Sections */}
      <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Compte
          </Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
              onPress={handleLogout}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FF3B30' }]}>
                  <Ionicons name="log-out" size={20} color="white" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: '#FF3B30' }]}>
                    Se déconnecter
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    Fermer votre session
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FF3B30' }]}>
                  <Ionicons name="trash" size={20} color="white" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: '#FF3B30' }]}>
                    Supprimer le compte
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    Supprimer définitivement
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            FASTCUBE Mobile v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editProfileButton: {
    padding: 8,
  },
  settingsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
  },
});

export default SettingsScreen;
