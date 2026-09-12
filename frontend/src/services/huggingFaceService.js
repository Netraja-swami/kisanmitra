/**
 * KisanMitra Plant Disease Service
 *
 * Image → Spring Boot → Gemini Vision
 *
 * Hugging Face is no longer used.
 */

export function formatDiseaseLabel(rawLabel) {
  if (!rawLabel) {
    return {
      crop: 'Plant',
      disease: 'Unknown Condition',
      isHealthy: false
    };
  }

  const parts = rawLabel.split('___');

  let crop = (parts[0] || 'Plant')
    .replace(/_/g, ' ')
    .replace(/\(.*\)/g, '')
    .trim();

  let disease = (parts[1] || parts[0] || 'Condition')
    .replace(/_/g, ' ')
    .trim();

  crop =
    crop.charAt(0).toUpperCase() +
    crop.slice(1);

  disease =
    disease.charAt(0).toUpperCase() +
    disease.slice(1);

  const isHealthy =
    disease.toLowerCase().includes('healthy');

  return {
    raw: rawLabel,
    crop,
    disease,
    isHealthy,
    displayName: isHealthy
      ? `${crop} (Healthy / स्वस्थ)`
      : `${crop} - ${disease}`
  };
}


export async function classifyPlantDisease(
  imageBlob,
  apiKey = ''
) {

  const token =
    localStorage.getItem('kisanmitra_jwt');

  if (!token) {
    throw new Error(
      'Please login again to continue.'
    );
  }

  if (!imageBlob) {
    throw new Error(
      'Please select an image first.'
    );
  }


  const userId =
    localStorage.getItem(
      'kisanmitra_user_id'
    );


  const formData =
    new FormData();

  formData.append(
    'image',
    imageBlob
  );


  const response =
    await fetch(
      `https://kisanmitra-07c4.onrender.com/api/chat/image?userId=${userId || ''}`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`
        },

        body: formData
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(
      'Image analysis error:',
      response.status,
      errorText
    );

    throw new Error(
      `Image analysis failed (${response.status})`
    );
  }


  const data =
    await response.json();


  if (!data.success) {

    throw new Error(
      data.response ||
      'Image analysis failed'
    );
  }


  return {
    label: 'Gemini Vision Analysis',
    score: 1,
    details: {
      crop: 'Plant',
      disease: 'AI Analysis',
      isHealthy: false,
      displayName:
        'Gemini Plant Analysis'
    },
    response: data.response,
    isFallback: false
  };
}
