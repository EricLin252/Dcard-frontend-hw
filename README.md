# Dcard-frontend-hw

## 網頁功能
- 右上選單可選擇要顯示的都市景點，或是選擇"所有都市"以顯示所有景點
- 若景點的右方出現向下箭頭，可點選景點標題，即可展開景點的詳細描述
- 持續向下滑動，可以更新更多景點，若此都市已無更多景點，會於最下方顯示"沒有更多景點了"

## 程式架構
本網站是由三個component構成，並由一份database.js負責操作資料讀取的工作

- Block: 顯示一個景點的名字，並可點選開啟景點的詳述
  > props.spotName: 景點名  
  > props.content (optional): 景點詳述  
  > state.openContent: 決定詳述內容是否顯示

- List: 顯示目前選擇的都市的所有景點，下滑可讀取更多景點
  > props.selectCity: 目前顯示的都市  
  > state.loading: 決定是否載入新資料  
  > loadData(): 命令dataBase.js更新data  
  > setBlocks(): 渲染各景點的Block  
  > checkScroll(): 確認是否滑到頁面底部

- Page: 包裹整個應用的元件
  > state.selectCity: 使用者選擇的都市

- database.js: 控制所有對資料的操作
  > data: 暫存目前所有讀入的景點資料  
  > dataEnd: 紀錄目前是否已讀到資料結尾  
  > fetchData(amt, city): 根據要求的讀入筆數amt與讀入都市city向政府的資料庫獲取資料，並新增進data中  
  > getData(): component獲得資料的途徑  
  > clearData(): component可以呼叫這個函數清空暫存資料

## 資料流與程式運行順序
- 當用戶開啟網站時
  1. setBlocks()會先根據getData()得出的空資料陣列繪製出空的List
  2. List的componentDidMount()呼叫一次loadData()
  3. loadData()呼叫fetchData(30, "")，結束後將state.loading設為false
  4. List再次渲染，setBlocks()即可獲得剛剛讀入的資料

- 當用戶切換都市時
  1. Page更新自身的state.selectCity，使其傳遞至List的props.selectCity
  2. List的componentDidUpdate()得知選擇的都市更動，呼叫clearData()清空資料，並將state.loading設為true
  3. state.loading作為更新的信號，使componentDidUpdate()呼叫loadData()
  4. 同上面的 "當用戶開啟網站時" 的4~5步，完成渲染網頁

- 當用戶繼續下滑頁面至底時
  1. List的checkScroll()在確認到頁面滑動到底部時，將state.loading設為true
  2. 同上面的 "當用戶切換都市時" 的3~4步，完成渲染網頁
