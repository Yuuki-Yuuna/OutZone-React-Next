const text = ['txt', 'doc', 'docx', 'xls', 'pdf']
const image = ['png', 'jpg', 'jpeg', 'webp']
const audio = ['mp3', 'flac', 'wav']
const video = ['mp4']
const zip = ['rar', 'zip', '7z']
const mobile = ['apk']

export const checkFileType = (filename: string) => {
  const slice = filename.split('.')
  const extname = slice[slice.length - 1] //扩展名
  // console.log(extname)
  if (text.includes(extname)) {
    return 'text'
  } else if (image.includes(extname)) {
    return 'image'
  } else if (audio.includes(extname)) {
    return 'audio'
  } else if (video.includes(extname)) {
    return 'video'
  } else {
    return 'other'
  }
}

export const getFileIconName = (filename: string) => {
  const slice = filename.split('.')
  const extname = slice[slice.length - 1] //扩展名
  // console.log(extname)
  if ([...text, ...mobile].includes(extname)) {
    return extname
  } else if (image.includes(extname)) {
    return 'image'
  } else if (audio.includes(extname)) {
    return 'audio'
  } else if (video.includes(extname)) {
    return 'video'
  } else if (zip.includes(extname)) {
    return 'zip'
  } else {
    return 'other'
  }
}

export const computedFileSize = (byte?: number | null) => {
  let size = '-'
  if (typeof byte == 'number') {
    if (byte < 1024) {
      size = byte + 'B'
    } else if (byte < 1024 ** 2) {
      size = (byte / 1024).toFixed(1) + 'K'
    } else if (byte < 1024 ** 3) {
      size = (byte / 1024 / 1024).toFixed(1) + 'M'
    } else {
      size = (byte / 1024 / 1024 / 1024).toFixed(1) + 'G'
    }
  }
  return size
}
