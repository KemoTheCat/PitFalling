import { supabase } from './supabaseClient'

export async function uploadAvatar(userId: string, file: File) {
  const path = `${userId}/avatar.jpg`
  // limpiar anterior
  await supabase.storage.from('avatars').remove([path]).catch(() => {})
  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type || 'image/jpeg'
  })
  if (error) throw error
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
