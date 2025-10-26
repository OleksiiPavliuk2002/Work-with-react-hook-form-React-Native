import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { sendData } from "./services/sendDate";

export default function App() {
  const today = new Date();
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      checkInDate: today,
      checkOutDate: null,
      roomType: 'standard',
    },
    mode: 'onChange',
  });

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');

  useEffect(() => {
    if (checkOutDate) {
      trigger('checkOutDate');
    }
  }, [checkInDate, checkOutDate, trigger]);

  const validateCheckOutDate = (value) => {
    if (!value) return 'Check-Out Date is required';
    if (checkInDate && value <= checkInDate) {
      return 'The Check-Out Date must be later than the Check-In Date';
    }
    return true;
  };

  const onSubmit = (data) => {
    sendData({
      userName: data.userName,
      email: data.email,
      roomType: data.roomType,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.formHeader}>Booking form</Text>
        <Text style={styles.formTitle}>Name</Text>
        <Controller
          control={control}
          name="userName"
          rules={{
            required: 'Name is required',
            pattern: {
              value: /^[A-Z][a-zA-Z\s]{2,}$/,
              message:
                'Name must start with a capital letter and contain at least 3 characters',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              testID="user-name-input"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="Enter your name"
            />
          )}
        />
        {errors.userName && (
          <Text style={styles.errorText}>{errors.userName.message}</Text>
        )}

        <Text style={styles.formTitle}>email</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'e-mail is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message:
                'Invalid email address. Please enter a valid email',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              testID="email-input"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Text style={styles.formTitle}>Check-In Date</Text>
        <Controller
          control={control}
          name="checkInDate"
          rules={{ required: 'Check-In Date is required' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowCheckInPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {(value || today).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showCheckInPicker && (
                <DateTimePicker
                  testID="date-time-picker"
                  value={value || today}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowCheckInPicker(false);
                    if (event?.type !== 'dismissed') {
                      onChange(selectedDate || value);
                    }
                  }}
                />
              )}
            </>
          )}
        />

        <Text style={styles.formTitle}>Check-Out Date</Text>
        <Controller
          control={control}
          name="checkOutDate"
          rules={{
            validate: validateCheckOutDate,
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowCheckOutPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {value ? value.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showCheckOutPicker && (
                <DateTimePicker
                  testID="date-time-picker"
                  value={value || today}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowCheckOutPicker(false);
                    if (event?.type !== 'dismissed') {
                      onChange(selectedDate || value);
                    }
                  }}
                />
              )}
            </>
          )}
        />
        {errors.checkOutDate && (
          <Text style={styles.errorText}>{errors.checkOutDate.message}</Text>
        )}

        <Text style={styles.formTitle}>Choose the room type:</Text>
        <Controller
          control={control}
          name="roomType"
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label="Standard" value="standard" />
              <Picker.Item label="Luxury" value="luxury" />
              <Picker.Item label="Family" value="family" />
            </Picker>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          title="Submit"
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 4,
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  formHeader: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 30,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  dateButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

