const spreadsheet = SpreadsheetApp.getActive()
const ui = SpreadsheetApp.getUi()

const imageIds = {
  runArrow: "17EdBPvXpy7Cgak6uPt9K9b-w5DbNjVZI"
}

const funcMap = {
  "Order Randomizer":"orderRandomizer",
  "Group Creator":"groupCreator"
}
const imageUrl = (imid) => `https://docs.google.com/uc?export=view&id=${imid}`

function orderRandomizer() {
  if((classList = getClassList()).length > 0) {
    let orderTab = spreadsheet.getSheetByName("Order Randomizer")
    if(!orderTab) orderTab = spreadsheet.insertSheet("Order Randomizer")
    else {
      orderTab.clear()
    }
    orderTab.autoResizeColumns(1, 2)
    orderTab.getRange(1, 1, classList.length + 1, 2).setValues([["Order", "Student"]].concat(shuffle(classList).map((s, idx) => [`${idx+1}`, s]))).setHorizontalAlignment("center")
    spreadsheet.setActiveSheet(orderTab)
  } else {
    ui.alert("No students found--make sure to add students to the Class List tab!")
  }
}

function groupCreator() {
  Logger.log("Called Group Creator!")
}

function getClassList() {
  let classTab = spreadsheet.getSheetByName("Class List")
  if(!classTab) {
    classTab = spreadsheet.insertSheet("Class List")
    return []
  } else {
    return classTab.getRange(2, 1, classTab.getLastRow() - 1, 2).getDisplayValues().map(r => r.map(np => np.trim()).join(" "))
  }
}


function test(){
  Logger.log(getClassList())
}


function createImages() {
  const homeTab = spreadsheet.getSheetByName("Home")
  const homeValues = homeTab.getRange(2, 1, homeTab.getLastRow() - 1).getDisplayValues().flat().map(v => v.trim())
  
  const runImage = homeTab.insertImage(imageUrl(imageIds.runArrow), 2, 2)
  const [imgWidth, imgHeight] = [runImage.getWidth(), runImage.getHeight()]
  
  const images = homeTab.getImages()
  images.forEach(im => im.remove())
  
  const request = {
    requests: [{
      updateDimensionProperties: {
        properties: {pixelSize: imgHeight},
        range: {sheetId: homeTab.getSheetId(), startIndex: 1, endIndex: homeTab.getLastRow(), dimension: "ROWS"},
        fields: "pixelSize"
      }
    }, {
      updateDimensionProperties: {
        properties: {pixelSize: imgWidth},
        range: {sheetId: homeTab.getSheetId(), startIndex: 1, dimension: "COLUMNS"},
        fields: "pixelSize"
      }
    }]
  }
  
  Sheets.Spreadsheets.batchUpdate(request, spreadsheet.getId())
  for(let i = 2; i <= homeTab.getLastRow(); i++) {
    const runImage = homeTab.insertImage(imageUrl(imageIds.runArrow), 2, i)
    runImage.assignScript(funcMap[homeValues[i - 2]])
  }
}

function shuffle(sArr) {
  let arr = JSON.parse(JSON.stringify(sArr))
  for(let i = arr.length - 1, s = Math.floor(Math.random() * (i + 1)); i > 0; i--, s = Math.floor(Math.random() * (i + 1))) {
    [arr[i], arr[s]] = [arr[s], arr[i]]
  }
  return arr
}