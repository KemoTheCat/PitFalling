export async function uploadAvatar(_userId: string, file: File) {
  // Placeholder: simulate an upload and return a data URL
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo procesar la imagen.'))
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}
