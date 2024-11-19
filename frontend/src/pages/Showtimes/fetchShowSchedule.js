export const fetchShowSchedule = async (date, areaCode) => {
  try {
    const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${areaCode}&dt=${date}`);
    const text = await response.text();
    console.log('Raw XML Response:', text); // Debugging

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');

    return Array.from(xml.getElementsByTagName('Show')).map((show) => ({
      id: show.getElementsByTagName('ID')[0]?.textContent || 'No ID',
      title: show.getElementsByTagName('Title')[0]?.textContent || 'No Title',
      originalTitle: show.getElementsByTagName('OriginalTitle')[0]?.textContent || 'No Original Title',
      productionYear: show.getElementsByTagName('ProductionYear')[0]?.textContent || 'Unknown Year',
      startTime: show.getElementsByTagName('dttmShowStart')[0]?.textContent || 'No Start Time',
      startTimeUTC: show.getElementsByTagName('dttmShowStartUTC')[0]?.textContent || 'No Start Time UTC',
      endTime: show.getElementsByTagName('dttmShowEnd')[0]?.textContent || 'No End Time',
      endTimeUTC: show.getElementsByTagName('dttmShowEndUTC')[0]?.textContent || 'No End Time UTC',
      theatre: show.getElementsByTagName('Theatre')[0]?.textContent || 'No Theatre',
      auditorium: show.getElementsByTagName('TheatreAuditorium')[0]?.textContent || 'No Auditorium',
      duration: show.getElementsByTagName('LengthInMinutes')[0]?.textContent || 'Unknown',
      rating: show.getElementsByTagName('Rating')[0]?.textContent || 'No Rating',
      ratingImageUrl: show.getElementsByTagName('RatingImageUrl')[0]?.textContent || '',
      genres: show.getElementsByTagName('Genres')[0]?.textContent || 'No Genres',
      presentationMethod: show.getElementsByTagName('PresentationMethodAndLanguage')[0]?.textContent || 'Unknown Format',
      contentDescriptors: Array.from(show.getElementsByTagName('ContentDescriptor')).map((descriptor) => ({
        name: descriptor.getElementsByTagName('Name')[0]?.textContent || '',
        imageUrl: descriptor.getElementsByTagName('ImageURL')[0]?.textContent || '',
      })),
      imageUrl: show.getElementsByTagName('EventLargeImagePortrait')[0]?.textContent || '',
      showUrl: show.getElementsByTagName('ShowURL')[0]?.textContent || '',
      eventUrl: show.getElementsByTagName('EventURL')[0]?.textContent || '',
    }));
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return [];
  }
};
