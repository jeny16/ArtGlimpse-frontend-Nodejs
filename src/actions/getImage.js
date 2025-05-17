import conf from '../conf';

export function getImageUrl(img) {
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${img}/view?project=${conf.appwriteProjectId}&mode=admin`;
  }
  