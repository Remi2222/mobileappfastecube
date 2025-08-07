import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const BlogListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Les tendances du développement web en 2024',
      excerpt: 'Découvrez les nouvelles technologies qui façonnent l\'avenir du web...',
      author: 'Ahmed Ben Ali',
      date: '2024-01-15',
      category: 'Développement',
      readTime: '5 min',
      image: 'https://via.placeholder.com/300x200',
      tags: ['React', 'Web', 'Tendances'],
    },
    {
      id: 2,
      title: 'Guide complet React Native pour débutants',
      excerpt: 'Apprenez à créer votre première application mobile avec React Native...',
      author: 'Sarah Chen',
      date: '2024-01-12',
      category: 'Mobile',
      readTime: '8 min',
      image: 'https://via.placeholder.com/300x200',
      tags: ['React Native', 'Mobile', 'Tutorial'],
    },
    {
      id: 3,
      title: 'Optimisation des performances web',
      excerpt: 'Techniques avancées pour améliorer la vitesse de votre site web...',
      author: 'Mohammed El Amri',
      date: '2024-01-10',
      category: 'Performance',
      readTime: '6 min',
      image: 'https://via.placeholder.com/300x200',
      tags: ['Performance', 'Optimisation', 'Web'],
    },
    {
      id: 4,
      title: 'Introduction à l\'IA dans le développement',
      excerpt: 'Comment l\'intelligence artificielle transforme le développement logiciel...',
      author: 'Ahmed Ben Ali',
      date: '2024-01-08',
      category: 'IA',
      readTime: '10 min',
      image: 'https://via.placeholder.com/300x200',
      tags: ['IA', 'Machine Learning', 'Innovation'],
    },
  ]);

  const categories = [
    { id: 'all', name: 'Tous', icon: 'grid-outline' },
    { id: 'Développement', name: 'Développement', icon: 'code-outline' },
    { id: 'Mobile', name: 'Mobile', icon: 'phone-portrait-outline' },
    { id: 'Performance', name: 'Performance', icon: 'speedometer-outline' },
    { id: 'IA', name: 'IA', icon: 'bulb-outline' },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={[styles.articleCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('BlogPost', { articleId: item.id })}
    >
      <View style={styles.articleImage}>
        <LinearGradient
          colors={['#007AFF', '#5856D6']}
          style={styles.imagePlaceholder}
        >
          <Ionicons name="newspaper" size={40} color="white" />
        </LinearGradient>
      </View>
      
      <View style={styles.articleContent}>
        <View style={styles.articleMeta}>
          <Text style={[styles.articleCategory, { color: theme.colors.primary }]}>
            {item.category}
          </Text>
          <Text style={[styles.articleReadTime, { color: theme.colors.textSecondary }]}>
            {item.readTime}
          </Text>
        </View>
        
        <Text style={[styles.articleTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        
        <Text style={[styles.articleExcerpt, { color: theme.colors.textSecondary }]}>
          {item.excerpt}
        </Text>
        
        <View style={styles.articleFooter}>
          <View style={styles.authorInfo}>
            <Ionicons name="person-circle" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.authorName, { color: theme.colors.textSecondary }]}>
              {item.author}
            </Text>
          </View>
          <Text style={[styles.articleDate, { color: theme.colors.textSecondary }]}>
            {item.date}
          </Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        {
          backgroundColor: selectedCategory === item.id ? theme.colors.primary : theme.colors.surface,
        }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={selectedCategory === item.id ? 'white' : theme.colors.textSecondary} 
      />
      <Text style={[
        styles.categoryText,
        { color: selectedCategory === item.id ? 'white' : theme.colors.textSecondary }
      ]}>
        {item.name}
      </Text>
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
          <Text style={styles.headerTitle}>Blog FASTCUBE</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Rechercher un article..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Articles List */}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticle}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articlesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Aucun article trouvé
            </Text>
          </View>
        }
      />
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
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  articlesList: {
    padding: 16,
  },
  articleCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleImage: {
    height: 150,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleContent: {
    padding: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  articleReadTime: {
    fontSize: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    marginLeft: 4,
  },
  articleDate: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default BlogListScreen;
