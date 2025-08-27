// backend/database.js
import { supabase } from './supabaseClient.js';

// Profiles Table
export const createUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase.from('profiles').insert([{ id: userId, ...profileData }]);
  if (error) throw new Error(error.message);
  return data;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw new Error(error.message);
  return data;
};

// Medications Table
export const addMedication = async (medicationData) => {
  const { data, error } = await supabase.from('medications').insert([medicationData]);
  if (error) throw new Error(error.message);
  return data;
};

export const getMedications = async (userId) => {
  const { data, error } = await supabase.from('medications').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
};

export const updateMedication = async (medicationId, updates) => {
  const { data, error } = await supabase.from('medications').update(updates).eq('id', medicationId);
  if (error) throw new Error(error.message);
  return data;
};

export const deleteMedication = async (medicationId) => {
  const { data, error } = await supabase.from('medications').delete().eq('id', medicationId);
  if (error) throw new Error(error.message);
  return data;
};

// Reminders Table
export const addReminder = async (reminderData) => {
  const { data, error } = await supabase.from('reminders').insert([reminderData]);
  if (error) throw new Error(error.message);
  return data;
};

export const getReminders = async (userId) => {
  const { data, error } = await supabase.from('reminders').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
};

export const updateReminder = async (reminderId, updates) => {
  const { data, error } = await supabase.from('reminders').update(updates).eq('id', reminderId);
  if (error) throw new Error(error.message);
  return data;
};

export const deleteReminder = async (reminderId) => {
  const { data, error } = await supabase.from('reminders').delete().eq('id', reminderId);
  if (error) throw new Error(error.message);
  return data;
};

// Adherence Table
export const logAdherence = async (adherenceData) => {
  const { data, error } = await supabase.from('adherence').insert([adherenceData]);
  if (error) throw new Error(error.message);
  return data;
};

export const getAdherence = async (userId) => {
  const { data, error } = await supabase.from('adherence').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
};
