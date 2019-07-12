const ref = new Wilddog("https://kylin.wilddogio.com/bookmarks");

/**
 * 书签格式转换
 */
const bookmarksFormat = (bookmarks) => {
  
  /**
	 * 深度遍历树，filter
	 */
  const dfsFilter = (tree, callback) => {
    let resTree = [];
    const dfs = (tree, callback) => {
      for (var i = 0; i < tree.length; i++) {
        if (callback(tree[i])) {
          resTree.push(tree[i]);
        }
        if (tree[i].children && tree[i].children.length > 0) {
          dfs(tree[i].children, callback);
        }
      }
      return tree;
    }
    dfs(tree, callback);
    return resTree;
  };

  /**
	 * 深度遍历树，map
	 */
	const dfsMap = (tree, callback) => {
		for (var i = 0; i < tree.length; i++) {
      callback && (tree[i] = callback(tree[i]));
			if (tree[i].children && tree[i].children.length > 0) {
				dfsMap(tree[i].children, callback);
			}
		}
		return tree;
  };

  bookmarks = dfsFilter(bookmarks, ({ title }) => title === "书签栏");

  bookmarks[0].key = "root";

  return dfsMap(bookmarks, (node) => {
    if (node.children) {
      return {
        isLeaf: false,
        key: node.id,
        title: node.title,
        children: node.children,
      }
    } else {
      return {
        isLeaf: true,
        key: node.id,
        title: node.title,
        url: node.url,
      }
    }
  });
};

/**
 * 格式化时间
 * @param {*} fmt 
 * @param {*} date 
 */
const dateFormat = (date, fmt = "yyyy-MM-dd") => {
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * 获取当前时间
 */
const getCurrentTime = () => {
  return dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
};

/**
 * 数据过滤，过滤掉所有值为undefined的字段（因为有这些字段的存在无法执行add操作）
 */
const filter = (data) => {
  const deepCopy = (p, c) => {
    var c = c || {};
    for (var i in p) {
      if (typeof p[i] === "object") {
        c[i] = (p[i].constructor === Array) ? [] : {};
        deepCopy(p[i], c[i]);
      } else {
        if (p[i] === undefined) {
          c[i] = null;
        } else {
          c[i] = p[i];
        }
      }
    }
    return c;
  }
  if (!data) {
    return null;
  }
  return deepCopy(data);
};

btnSync.onclick = function sync() {
  chrome.bookmarks.getTree(function (bookmarks) {
    bookmarks = bookmarksFormat(bookmarks);
    console.log(bookmarks);
    // ref.set(filter(bookmarks));
    ref.set(filter([]));
    alert(`书签已同步，当前时间：${getCurrentTime()}`);
  });
}