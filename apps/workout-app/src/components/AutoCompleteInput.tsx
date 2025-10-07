import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, List, TextInput } from 'react-native-paper';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  suggestions: string[];
  style?: object;
};

export default function AutoCompleteInput({ value, onChangeText, placeholder, suggestions, style }: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else setShowSuggestions(false);
  }, [value]);

  const handleSuggestionPress = (suggestion: string) => {
    onChangeText(suggestion);
    setShowSuggestions(false);
  };

  return (
    <View style={style}>
      <TextInput
        mode="outlined"
        label={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => value.length && filteredSuggestions.length && setShowSuggestions(true)}
      />
      {showSuggestions && (
        <Surface style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          zIndex: 1000,
          elevation: 4,
          borderRadius: 8,
          maxHeight: 200,
        }}>
          <ScrollView nestedScrollEnabled>
            {filteredSuggestions.map((suggestion, index) => (
              <List.Item key={index} title={suggestion} onPress={() => handleSuggestionPress(suggestion)} />
            ))}
          </ScrollView>
        </Surface>
      )}
    </View>
  );
}
