import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const faqs = [
  {
    question: '如何切换不同的热榜来源？',
    answer: '在首页的顶部，您会看到一个下拉菜单或一组标签，点击它们可以切换不同的热榜来源，例如知乎、微博等。',
  },
  {
    question: '为什么有些热榜内容无法打开？',
    answer: '部分热榜内容的链接可能因为源网站的限制或网络问题而无法直接打开。您可以尝试刷新页面或检查您的网络连接。',
  },
  {
    question: '如何编辑我的个人资料？',
    answer: '在“我的”页面，点击“编辑资料”按钮，您可以修改您的头像、昵称等信息。',
  },
  {
    question: '这个应用是免费的吗？',
    answer: '是的，本应用完全免费，所有功能都可以无限制使用。',
  },
];

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>常见问题</Text>
      </View>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{`${index + 1}. ${faq.question}`}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      ))}
      <View style={styles.footer}>
        <Text style={styles.footerText}>如果以上未能解决您的问题，请通过应用商店的反馈渠道与我们联系。</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  faqItem: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 10,
    marginHorizontal:10,
    borderRadius:8
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
