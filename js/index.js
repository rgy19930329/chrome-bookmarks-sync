btnSync.onclick = function sync() {
  chrome.bookmarks.getTree(function(bookmarkArray){
    console.log(bookmarkArray);
    alert(bookmarkArray)
  });
}
