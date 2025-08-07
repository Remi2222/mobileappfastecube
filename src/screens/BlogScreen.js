import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const BlogScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading blog posts
    const mockPosts = [
      {
        id: 1,
        title: 'Les tendances du développement web en 2024',
        excerpt: 'Découvrez les nouvelles technologies qui façonnent le web moderne...',
        author: 'FASTCUBE Team',
        date: '2024-01-15',
        image: 'https://via.placeholder.com/300x200',
        category: 'Développement Web',
      },
      {
        id: 2,
        title: 'React Native vs Flutter : Quel framework choisir ?',
        excerpt: 'Comparaison approfondie des deux frameworks de développement mobile...',
        author: 'FASTCUBE Team',
        date: '2024-01-10',
        image: 'https://via.placeholder.com/300x200',
        category: 'Mobile',
      },
      {
        id: 3,
        title: 'L\'importance de l\'UX dans le développement moderne',
        excerpt: 'Comment créer des expériences utilisateur exceptionnelles...',
        author: 'FASTCUBE Team',
        date: '2024-01-05',
        image: 'https://via.placeholder.com/300x200',
        category: 'Design',
      },
    ];
    
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const renderPostCard = (post) => (
    <TouchableOpacity
      key={post.id}
      style={[styles.postCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('BlogPost', { postId: post.id })}
    >
      <View style={styles.postImageContainer}>
        <View style={[styles.postImage, { backgroundColor: theme.colors.border }]}>
          <Ionicons name="image-outline" size={40} color={theme.colors.textSecondary} />
        </View>
      </View>
      <View style={styles.postContent}>
        <View style={styles.postMeta}>
          <Text style={[styles.postCategory, { color: theme.colors.primary }]}>
            {post.category}
          </Text>
          <Text style={[styles.postDate, { color: theme.colors.textSecondary }]}>
            {new Date(post.date).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        <Text style={[styles.postTitle, { color: theme.colors.text }]}>
          {post.title}
        </Text>
        <Text style={[styles.postExcerpt, { color: theme.colors.textSecondary }]}>
          {post.excerpt}
        </Text>
        <View style={styles.postFooter}>
          <Text style={[styles.postAuthor, { color: theme.colors.textSecondary }]}>
            Par {post.author}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Chargement des articles...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Blog
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Derniers articles
        </Text>
      </View>

      <View style={styles.postsContainer}>
        {posts.map(renderPostCard)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  postsContainer: {
    padding: 20,
  },
  postCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postImageContainer: {
    height: 200,
  },
  postImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    padding: 20,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  postDate: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  postExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAuthor: {
    fontSize: 12,
  },
});

export default BlogScreen;
