// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesButton = document.getElementById('get-images-btn');
const gallery = document.getElementById('gallery');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

getImagesButton.addEventListener('click', getSpaceImages);

async function getSpaceImages() {
    const startDate = format(startInput.value);
    const endDate = format(endInput.value);
    console.log(startDate);
    console.log(endDate);

    const apiUrl = `https://science.nasa.gov/wp-json/wp/v2/apod-basic?api_key=HKwf8tKbzjMbqpHbNPKftMjMgPcrcMFjBqJRGGMR&date_from=${startDate}&date_to=${endDate}`;

    try {
        gallery.innerHTML = '<p>Loading space images...</p>';
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch NASA images');
        }

        const apodItems = await response.json();
        console.log(apodItems);
        gallery.innerHTML = '';
        apodItems.forEach(item => {
          if (item.media_type !== 'image') {
              return;
          }

          const galleryItem = document.createElement('div');
          galleryItem.classList.add('gallery-item');
          const img = document.createElement('img');
          img.src = item.hdurl;
          img.alt = item.title;
          const title = document.createElement('h3');
          title.textContent = item.title;
          const date = document.createElement('p');
          date.textContent = item.date;
          galleryItem.appendChild(img);
          galleryItem.appendChild(title);
          galleryItem.appendChild(date);
          gallery.appendChild(galleryItem);
        });

        if (gallery.children.length === 0) {
            gallery.innerHTML = '<p>No images found for this date range.</p>';
        }

    } catch (error) {
        console.error('Error:', error);
        gallery.innerHTML = '<p>Something went wrong loading the images. Please try again.</p>';
    }
}

// Needed to use date format YYMMDD instead of YYYY-MM-DD for the API to be fetched
function format(date) {
  let dashless = date.replaceAll("-", "");
  dashless = dashless.slice(2);
  return dashless;
}