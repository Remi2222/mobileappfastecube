import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const ChatbotScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Bonjour ! Je suis l\'assistant virtuel FASTCUBE. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const quickReplies = [
    'Comment créer un ticket ?',
    'Quels sont vos services ?',
    'Comment contacter le support ?',
    'Informations sur les prix',
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simuler la réponse du bot
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('ticket') || input.includes('créer')) {
      return 'Pour créer un ticket, allez dans la section "Tickets" et cliquez sur "Nouveau Ticket". Vous pourrez alors décrire votre problème en détail.';
    } else if (input.includes('service') || input.includes('offre')) {
      return 'FASTCUBE propose plusieurs services : développement web, applications mobiles, consulting IT, et formation. Voulez-vous plus de détails sur un service particulier ?';
    } else if (input.includes('contact') || input.includes('support')) {
      return 'Vous pouvez nous contacter via email à contact@fastcube.com, par téléphone au +33 1 23 45 67 89, ou directement via l\'application dans la section Contact.';
    } else if (input.includes('prix') || input.includes('tarif')) {
      return 'Nos tarifs varient selon le projet. Je vous recommande de nous contacter pour un devis personnalisé. Voulez-vous que je vous mette en relation avec notre équipe commerciale ?';
    } else {
      return 'Je ne suis pas sûr de comprendre votre demande. Pouvez-vous reformuler ou choisir une option dans les réponses rapides ci-dessous ?';
    }
  };

  const handleQuickReply = (reply) => {
    setInputText(reply);
    handleSendMessage();
  };

  const handleVoiceRecord = () => {
    setIsRecording(true);
    Alert.alert(
      'Enregistrement Vocal',
      'Fonctionnalité en cours de développement. Utilisez le clavier pour le moment.',
      [
        {
          text: 'OK',
          onPress: () => setIsRecording(false)
        }
      ]
    );
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Upload d\'Image',
      'Fonctionnalité en cours de développement. Utilisez le texte pour le moment.',
      [
        {
          text: 'OK'
        }
      ]
    );
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: item.sender === 'user' ? theme.colors.primary : theme.colors.surface,
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.sender === 'user' ? 'white' : theme.colors.text }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          { color: item.sender === 'user' ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary }
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderQuickReply = ({ item }) => (
    <TouchableOpacity
      style={[styles.quickReplyButton, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleQuickReply(item)}
    >
      <Text style={[styles.quickReplyText, { color: theme.colors.text }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          <View style={styles.headerInfo}>
            <View style={styles.botAvatar}>
              <Ionicons name="chatbubble" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Assistant FASTCUBE</Text>
              <Text style={styles.headerSubtitle}>
                {isTyping ? 'En train d\'écrire...' : 'En ligne'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={scrollViewRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={[styles.typingBubble, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
            </View>
          </View>
        </View>
      )}

      {/* Quick Replies */}
      {messages.length === 1 && (
        <View style={styles.quickRepliesContainer}>
          <Text style={[styles.quickRepliesTitle, { color: theme.colors.text }]}>
            Réponses rapides :
          </Text>
          <FlatList
            data={quickReplies}
            renderItem={renderQuickReply}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesList}
          />
        </View>
      )}

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleImageUpload}
        >
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.textInputContainer}>
          <TextInput
            style={[styles.textInput, { 
              color: theme.colors.text,
              backgroundColor: theme.colors.background
            }]}
            placeholder="Tapez votre message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.textSecondary }
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons 
            name={inputText.trim() ? "send" : "mic"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingBubble: {
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 18,
    maxWidth: 60,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickRepliesContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickRepliesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickRepliesList: {
    gap: 8,
  },
  quickReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickReplyText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatbotScreen;
