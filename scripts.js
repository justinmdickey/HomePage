document.addEventListener('DOMContentLoaded', function() {
  // Initialize bookmarks functionality
  initBookmarks();
  initColorPicker();
  
  // Start the clock
  clock();  
  function clock() {
    var now = new Date();
    var TwentyFourHour = now.getHours();
    var hour = now.getHours();
    var min = now.getMinutes();
    var sec = now.getSeconds();
    var mid = 'pm';
    if (min < 10) {
      min = "0" + min;
    }
    if (hour > 12) {
      hour = hour - 12;
    }    
    if(hour==0){ 
      hour=12;
    }
    if(TwentyFourHour < 12) {
       mid = 'am';
    }     
    if (document.getElementById('currentTime')) {
      document.getElementById('currentTime').innerHTML = hour+':'+min+':'+sec +' '+mid;
    }
    setTimeout(clock, 1000);
  }
});

// ============== BOOKMARK FUNCTIONALITY ==============

function initBookmarks() {
  // Load bookmarks from local storage or use default ones
  loadBookmarksFromLocalStorage();
  
  // Add edit buttons to each bookmark item
  addEditButtonsToBookmarks();
  
  // Setup edit mode toggle button
  setupEditModeToggle();
  
  // Setup add new bookmark button for each category
  setupAddBookmarkButtons();
}

function loadBookmarksFromLocalStorage() {
  // Check if we have saved bookmarks
  const savedBookmarks = localStorage.getItem('bookmarks');
  
  if (savedBookmarks) {
    // Replace the bookmark sections with saved ones
    const bookmarkSections = JSON.parse(savedBookmarks);
    
    Object.keys(bookmarkSections).forEach(section => {
      const sectionElement = document.querySelector(`.card h3:contains('${section}')`);
      
      if (sectionElement) {
        const cardElement = sectionElement.closest('.card');
        const ulElement = cardElement.querySelector('ul');
        
        if (ulElement) {
          // Clear existing bookmarks
          ulElement.innerHTML = '';
          
          // Add saved bookmarks
          bookmarkSections[section].forEach(bookmark => {
            const li = document.createElement('li');
            li.className = 'bookmark-item';
            li.innerHTML = `<a target="_blank" href="${bookmark.url}">${bookmark.name}</a>`;
            ulElement.appendChild(li);
          });
        }
      }
    });
  }
}

function saveBookmarksToLocalStorage() {
  const bookmarks = {};
  
  // Get all bookmark sections
  document.querySelectorAll('.card h3').forEach(header => {
    const section = header.textContent;
    const card = header.closest('.card');
    
    if (card) {
      const bookmarkItems = [];
      
      // Get all bookmarks in this section
      card.querySelectorAll('.bookmark-item a').forEach(link => {
        bookmarkItems.push({
          name: link.textContent,
          url: link.getAttribute('href')
        });
      });
      
      if (bookmarkItems.length > 0) {
        bookmarks[section] = bookmarkItems;
      }
    }
  });
  
  // Save to local storage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function addEditButtonsToBookmarks() {
  // Add edit buttons to each bookmark item
  document.querySelectorAll('.bookmark-item').forEach(item => {
    // Check if this item already has an edit button
    if (!item.querySelector('.edit-button')) {
      const editButton = document.createElement('button');
      editButton.className = 'edit-button';
      editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
      editButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openBookmarkEditor(item);
      });
      
      item.appendChild(editButton);
    }
  });
}

function openBookmarkEditor(bookmarkItem) {
  const link = bookmarkItem.querySelector('a');
  const bookmarkName = link.textContent;
  const bookmarkUrl = link.getAttribute('href');
  
  // Create editor elements
  const editor = document.createElement('div');
  editor.className = 'bookmark-editor';
  
  // Create name input
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = bookmarkName;
  nameInput.placeholder = 'Bookmark name';
  
  // Create URL input
  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.value = bookmarkUrl;
  urlInput.placeholder = 'URL (https://...)';
  
  // Create buttons container
  const buttons = document.createElement('div');
  buttons.className = 'bookmark-editor-buttons';
  
  // Create save button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', function() {
    saveBookmark(bookmarkItem, nameInput.value, urlInput.value);
    bookmarkItem.parentNode.replaceChild(bookmarkItem, editor);
  });
  
  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      bookmarkItem.parentNode.removeChild(bookmarkItem);
      saveBookmarksToLocalStorage();
    } else {
      bookmarkItem.parentNode.replaceChild(bookmarkItem, editor);
    }
  });
  
  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', function() {
    bookmarkItem.parentNode.replaceChild(bookmarkItem, editor);
  });
  
  // Add buttons to container
  buttons.appendChild(saveButton);
  buttons.appendChild(deleteButton);
  buttons.appendChild(cancelButton);
  
  // Add elements to editor
  editor.appendChild(nameInput);
  editor.appendChild(urlInput);
  editor.appendChild(buttons);
  
  // Replace bookmark item with editor
  bookmarkItem.parentNode.replaceChild(editor, bookmarkItem);
  
  // Focus on name input
  nameInput.focus();
}

function saveBookmark(bookmarkItem, name, url) {
  // Update bookmark item
  const link = bookmarkItem.querySelector('a');
  link.textContent = name;
  link.setAttribute('href', url);
  
  // Save to local storage
  saveBookmarksToLocalStorage();
}

function setupEditModeToggle() {
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'toggle-edit-mode';
  toggleButton.innerHTML = '<i class="fas fa-edit"></i>';
  toggleButton.title = 'Toggle Edit Mode';
  
  toggleButton.addEventListener('click', function() {
    document.body.classList.toggle('edit-mode');
    
    // Update button icon based on edit mode
    if (document.body.classList.contains('edit-mode')) {
      toggleButton.innerHTML = '<i class="fas fa-check"></i>';
    } else {
      toggleButton.innerHTML = '<i class="fas fa-edit"></i>';
    }
  });
  
  // Add button to body
  document.body.appendChild(toggleButton);
}

function setupAddBookmarkButtons() {
  // Add "Add new bookmark" button to each card with a ul
  document.querySelectorAll('.card ul').forEach(ul => {
    const card = ul.closest('.card');
    
    if (card) {
      const addButton = document.createElement('button');
      addButton.textContent = 'Add New Bookmark';
      addButton.className = 'add-bookmark-button';
      addButton.style.display = 'none'; // Initially hidden
      
      addButton.addEventListener('click', function() {
        addNewBookmark(ul);
      });
      
      card.appendChild(addButton);
      
      // Show/hide add button based on edit mode
      document.body.addEventListener('click', function() {
        if (document.body.classList.contains('edit-mode')) {
          addButton.style.display = 'block';
        } else {
          addButton.style.display = 'none';
        }
      });
    }
  });
}

function addNewBookmark(ul) {
  // Create a new bookmark item
  const newItem = document.createElement('li');
  newItem.className = 'bookmark-item';
  newItem.innerHTML = '<a target="_blank" href="https://example.com">New Bookmark</a>';
  
  // Add edit button
  const editButton = document.createElement('button');
  editButton.className = 'edit-button';
  editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
  editButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    openBookmarkEditor(newItem);
  });
  
  newItem.appendChild(editButton);
  
  // Add to the list
  ul.appendChild(newItem);
  
  // Open editor immediately
  openBookmarkEditor(newItem);
}

// ============== COLOR PICKER FUNCTIONALITY ==============

function initColorPicker() {
  // Load colors from local storage
  loadColorsFromLocalStorage();
  
  // Create color picker toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'toggle-colors';
  toggleButton.innerHTML = '<i class="fas fa-palette"></i>';
  toggleButton.title = 'Customize Colors';
  
  toggleButton.addEventListener('click', function() {
    toggleColorPicker();
  });
  
  // Add button to body
  document.body.appendChild(toggleButton);
  
  // Create color picker
  createColorPicker();
}

function loadColorsFromLocalStorage() {
  // Load saved colors if they exist
  const savedColors = localStorage.getItem('customColors');
  
  if (savedColors) {
    const colors = JSON.parse(savedColors);
    
    // Apply saved colors
    Object.keys(colors).forEach(variable => {
      document.documentElement.style.setProperty(`--${variable}`, colors[variable]);
    });
  }
}

function saveColorsToLocalStorage() {
  const colors = {
    'card-title-color': getComputedStyle(document.documentElement).getPropertyValue('--card-title-color').trim(),
    'card-border-color': getComputedStyle(document.documentElement).getPropertyValue('--card-border-color').trim(),
    'card-background': getComputedStyle(document.documentElement).getPropertyValue('--card-background').trim(),
    'link-hover-color': getComputedStyle(document.documentElement).getPropertyValue('--link-hover-color').trim()
  };
  
  localStorage.setItem('customColors', JSON.stringify(colors));
}

function createColorPicker() {
  // Create color picker container
  const colorPicker = document.createElement('div');
  colorPicker.className = 'color-picker';
  colorPicker.style.display = 'none'; // Initially hidden
  
  // Add title
  const title = document.createElement('h4');
  title.textContent = 'Customize Colors';
  colorPicker.appendChild(title);
  
  // Add color options
  const colorOptions = [
    { label: 'Card Titles', variable: 'card-title-color' },
    { label: 'Card Borders', variable: 'card-border-color' },
    { label: 'Card Background', variable: 'card-background' },
    { label: 'Link Hover', variable: 'link-hover-color' }
  ];
  
  colorOptions.forEach(option => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    
    const label = document.createElement('label');
    label.textContent = option.label;
    
    const input = document.createElement('input');
    input.type = 'color';
    input.value = convertRgbToHex(getComputedStyle(document.documentElement)
      .getPropertyValue(`--${option.variable}`).trim());
    
    input.addEventListener('input', function() {
      document.documentElement.style.setProperty(`--${option.variable}`, input.value);
    });
    
    input.addEventListener('change', function() {
      saveColorsToLocalStorage();
    });
    
    colorOption.appendChild(label);
    colorOption.appendChild(input);
    
    colorPicker.appendChild(colorOption);
  });
  
  // Add reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset to Defaults';
  resetButton.addEventListener('click', function() {
    resetColorsToDefaults();
  });
  
  colorPicker.appendChild(resetButton);
  
  // Add to body
  document.body.appendChild(colorPicker);
}

function toggleColorPicker() {
  const colorPicker = document.querySelector('.color-picker');
  
  if (colorPicker) {
    if (colorPicker.style.display === 'none') {
      colorPicker.style.display = 'block';
    } else {
      colorPicker.style.display = 'none';
    }
  }
}

function resetColorsToDefaults() {
  // Reset to default colors
  document.documentElement.style.setProperty('--card-title-color', 'var(--primary)');
  document.documentElement.style.setProperty('--card-border-color', 'var(--foreground)');
  document.documentElement.style.setProperty('--card-background', 'var(--background)');
  document.documentElement.style.setProperty('--link-hover-color', 'var(--primary)');
  
  // Update color inputs
  document.querySelectorAll('.color-option input').forEach(input => {
    const variable = input.parentNode.querySelector('label').textContent.toLowerCase().replace(' ', '-');
    input.value = convertRgbToHex(getComputedStyle(document.documentElement)
      .getPropertyValue(`--${variable}`).trim());
  });
  
  // Save to local storage
  saveColorsToLocalStorage();
}

// Utility function to convert RGB to HEX color
function convertRgbToHex(rgb) {
  // If already a hex color, return it
  if (rgb.startsWith('#')) {
    return rgb;
  }
  
  // Extract RGB values
  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  }
  
  // Default fallback color
  return '#41a7fc';
}

// jQuery-like selector for text content
document.querySelectorSelector = Document.prototype.querySelector;
document.querySelector = function(selector) {
  if (selector.includes(':contains(')) {
    const match = selector.match(/:contains\('(.+?)'\)/);
    if (match) {
      const text = match[1];
      const elements = Array.from(this.querySelectorAll('*'));
      return elements.find(el => el.textContent.includes(text));
    }
  }
  return document.querySelectorSelector(selector);
};

Element.prototype.querySelectorSelector = Element.prototype.querySelector;
Element.prototype.querySelector = function(selector) {
  if (selector.includes(':contains(')) {
    const match = selector.match(/:contains\('(.+?)'\)/);
    if (match) {
      const text = match[1];
      const elements = Array.from(this.querySelectorAll('*'));
      return elements.find(el => el.textContent.includes(text));
    }
  }
  return this.querySelectorSelector(selector);
};