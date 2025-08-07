import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const BlogPostScreen = ({ route }) => {
  const { theme } = useTheme();
  const { postId } = route.params || {};

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Article #{postId || '1'}
        </Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          Contenu de l'article à venir...
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default BlogPostScreen;
