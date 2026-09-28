import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import formDefinition from '../config/siteCommissioning.json';
import {FormDefinition, FormValues, PhotoState, ValidationError} from '../types/form';
import {validateForm} from '../engine/validation';
import {saveDraftImmediate, loadDraft, clearDraft} from '../storage/formStorage';
import {DynamicSection} from '../components/DynamicSection';
import {ValidationSummary} from '../components/ValidationSummary';

const def = formDefinition as FormDefinition;

function getEmptyValues(): FormValues {
  const values: FormValues = {};
  for (const section of def.sections) {
    for (const field of section.fields) {
      values[field.id] = '';
    }
  }
  return values;
}

export default function SiteCommissioningScreen() {
  const [values, setValues] = useState<FormValues>(getEmptyValues);
  const [photos, setPhotos] = useState<PhotoState>({});
  const [status, setStatus] = useState<'draft' | 'complete'>('draft');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const initialized = useRef(false);

  // Load saved draft on mount
  useEffect(() => {
    async function init() {
      try {
        const draft = await loadDraft();
        if (draft && draft.formId === def.id) {
          setValues(draft.values);
          setPhotos(draft.photos);
          setStatus(draft.status);
          if (draft.updatedAt) {
            setSavedTime(new Date(draft.updatedAt).toLocaleTimeString());
          }
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
    init();
  }, []);

  // Validate on value change
  useEffect(() => {
    if (!loading) {
      const errs = validateForm(def, values);
      setErrors(errs);
    }
  }, [values, loading]);

  // Auto-save on value change (debounced)
  useEffect(() => {
    if (loading || !initialized.current) {
      initialized.current = true;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await saveDraftImmediate({
          formId: def.id,
          formVersion: def.version,
          values,
          photos,
          status,
          updatedAt: new Date().toISOString(),
        });
        setSavedTime(new Date().toLocaleTimeString());
      } catch {
        // ignore
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [values, photos, status, loading]);

  const handleChange = useCallback((fieldId: string, value: any) => {
    setValues(prev => ({...prev, [fieldId]: value}));
  }, []);

  const handleTogglePhoto = useCallback((label: string) => {
    setPhotos(prev => ({...prev, [label]: !prev[label]}));
  }, []);

  const requiredPhotos = getRequiredPhotos();
  const missingPhotos = requiredPhotos.filter(name => !photos[name]);
  const hasErrors = errors.length > 0;
  const hasMissingPhotos = missingPhotos.length > 0;
  const canComplete = !hasErrors && !hasMissingPhotos;

  function getRequiredPhotos(): string[] {
    const slots: string[] = [];
    for (const section of def.sections) {
      if (section.photos) {
        for (const group of section.photos) {
          if (group.slots) {
            slots.push(...group.slots);
          }
        }
      }
    }
    return slots;
  }

  const handleSaveDraft = async () => {
    try {
      await saveDraftImmediate({
        formId: def.id,
        formVersion: def.version,
        values,
        photos,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      });
      setStatus('draft');
      setSavedTime(new Date().toLocaleTimeString());
      Alert.alert('Saved', 'Draft saved successfully');
    } catch {
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const handleMarkComplete = () => {
    if (!canComplete) {
      Alert.alert(
        'Cannot Complete',
        'Please fix all validation errors and capture all required photos before marking as complete.',
      );
      return;
    }

    Alert.alert(
      'Confirm Completion',
      'Are you sure you want to mark this form as complete?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Complete',
          onPress: async () => {
            await saveDraftImmediate({
              formId: def.id,
              formVersion: def.version,
              values,
              photos,
              status: 'complete',
              updatedAt: new Date().toISOString(),
            });
            setStatus('complete');
            Alert.alert('Done', 'Form marked as complete');
          },
        },
      ],
    );
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Form',
      'This will erase all entered data. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearDraft();
            setValues(getEmptyValues());
            setPhotos({});
            setStatus('draft');
            setSavedTime(null);
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565c0" />
        <Text style={styles.loadingText}>Loading form...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{def.title}</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.version}>v{def.version}</Text>
            {savedTime && (
              <Text style={styles.savedTime}>Last saved: {savedTime}</Text>
            )}
            <View
              style={[
                styles.statusBadge,
                status === 'complete' ? styles.statusComplete : styles.statusDraft,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  status === 'complete'
                    ? styles.statusTextComplete
                    : styles.statusTextDraft,
                ]}>
                {status === 'complete' ? 'COMPLETE' : 'DRAFT'}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <ValidationSummary errors={errors} />

          {hasMissingPhotos && (
            <View style={styles.photoWarning}>
              <Text style={styles.photoWarningTitle}>
                {missingPhotos.length} missing photo{missingPhotos.length !== 1 ? 's' : ''}:
              </Text>
              {missingPhotos.map(name => (
                <Text key={name} style={styles.photoWarningItem}>
                  • {name}
                </Text>
              ))}
            </View>
          )}

          {def.sections.map(section => (
            <DynamicSection
              key={section.id}
              section={section}
              values={values}
              onChange={handleChange}
              onTogglePhoto={handleTogglePhoto}
              photos={photos}
              errors={errors}
            />
          ))}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveDraft}
            activeOpacity={0.7}>
            <Text style={styles.saveButtonText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.completeButton,
              !canComplete && styles.completeButtonDisabled,
            ]}
            onPress={handleMarkComplete}
            disabled={!canComplete}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.completeButtonText,
                !canComplete && styles.completeButtonTextDisabled,
              ]}>
              Mark Complete
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#1565c0',
    padding: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  version: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  savedTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusDraft: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statusComplete: {
    backgroundColor: '#4caf50',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTextDraft: {
    color: 'rgba(255,255,255,0.8)',
  },
  statusTextComplete: {
    color: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  photoWarning: {
    backgroundColor: '#fce4ec',
    borderWidth: 1,
    borderColor: '#e91e63',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  photoWarningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c2185b',
    marginBottom: 4,
  },
  photoWarningItem: {
    fontSize: 13,
    color: '#880e4f',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  clearButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1565c0',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1565c0',
  },
  completeButton: {
    flex: 1.5,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#4caf50',
  },
  completeButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  completeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  completeButtonTextDisabled: {
    color: '#999',
  },
});
