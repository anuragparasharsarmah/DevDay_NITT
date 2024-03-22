document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const bookmarksList = document.getElementById('bookmarksList');
    const addBookmarkBtn = document.getElementById('addBookmarkBtn');
    const deleteBookmarkBtn = document.getElementById('deleteBookmarkBtn');
    let selectedBookmark = null;
    let bookmarks = [];
  
    // Load bookmarks from Chrome Bookmarks API
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      bookmarks = getBookmarksFromTree(bookmarkTreeNodes[0].children);
      renderBookmarks(bookmarks);
    });
  
    // Search bookmarks
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredBookmarks = bookmarks.filter((bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm)
      );
      renderBookmarks(filteredBookmarks);
    });
  
    // Add bookmark
    addBookmarkBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log("Tabs:", tabs); // Log tabs array to inspect its contents
          if (!tabs || tabs.length === 0) {
            console.error("Error: No active tab found.");
            // Handle the absence of active tab (e.g., display an error message to the user)
            return;
          }
      
          const activeTab = tabs[0];
          console.log("Active tab:", activeTab); // Log active tab data
      
          // Check if activeTab is defined and has title and URL
          if (typeof activeTab.title === "undefined") {
            console.error("Error: Active tab title is not defined.");
            // Handle the case where active tab title is not defined
            return;
          } else if (!activeTab.url) {
            console.error("Error: Active tab URL is not defined.");
            // Handle the case where active tab URL is not defined
            return;
          }
      
          // Proceed with creating the bookmark
          chrome.bookmarks.create(
            {
              'parentId': '1', // Bookmarks bar folder
              'title': activeTab.title,
              'url': activeTab.url,
            },
            (newBookmark) => {
              console.log("New bookmark:", newBookmark); // Log new bookmark data
              const bookmarkItem = {
                id: newBookmark.id,
                title: newBookmark.title,
                url: newBookmark.url,
                dateAdded: newBookmark.dateAdded,
              };
              bookmarks.push(bookmarkItem);
              renderBookmarks(bookmarks);
            }
          );
        });
      });      
       
    // Delete bookmark
    deleteBookmarkBtn.addEventListener('click', () => {
      if (selectedBookmark) {
        chrome.bookmarks.remove(selectedBookmark.id, () => {
          bookmarks = bookmarks.filter((bookmark) => bookmark.id !== selectedBookmark.id);
          selectedBookmark = null;
          deleteBookmarkBtn.disabled = true;
          renderBookmarks(bookmarks);
        });
      }
    });
  
    // Render bookmarks
    function renderBookmarks(bookmarksToRender) {
      bookmarksList.innerHTML = '';
      bookmarksToRender.forEach((bookmark) => {
        const li = document.createElement('li');
        li.textContent = bookmark.title;
        li.addEventListener('click', () => {
          if (bookmark.url) {
            chrome.tabs.create({ url: bookmark.url });
          }
        });
        li.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          selectedBookmark = bookmark;
          deleteBookmarkBtn.disabled = false;
        });
        bookmarksList.appendChild(li);
      });
    }
  
    // Helper function to extract bookmarks from the Chrome Bookmarks Tree
    function getBookmarksFromTree(bookmarkTreeNodes) {
      let bookmarks = [];
      for (let node of bookmarkTreeNodes) {
        if (node.url) {
          bookmarks.push({
            id: node.id,
            title: node.title,
            url: node.url,
            dateAdded: node.dateAdded,
          });
        } else if (node.children) {
          const childrenWithUrls = node.children.filter((child) => child.url);
          if (childrenWithUrls.length > 0) {
            bookmarks = bookmarks.concat(getBookmarksFromTree(childrenWithUrls));
          }
        }
      }
      return bookmarks;
    }
  });