// ページ読み込み時
$(document).ready( function(){
  document.getElementById("export").addEventListener("click", ExportCSV, false);
  LoadLocalStorage();
});

// 手入力発生時
$(document).change(function() {
  SaveLocalStorage();
  CalcRate();
});

// LocalStorageにJSON形式で画面項目を保存する
function SaveLocalStorage()
{
  let save_list = {};
  for (let i = 0; i <= 7; i++) {
    save_list["input_win" + i] = document.getElementById("input_win" + i).value;
    save_list["input_lose" + i] = document.getElementById("input_lose" + i).value;
  }
  localStorage.setItem("save_list", JSON.stringify(save_list));
}

// LocalStorageから画面項目を読み込む(JSON形式)
function LoadLocalStorage()
{
  const save_list = JSON.parse(localStorage.getItem("save_list"));
  if(save_list){
    for (let key in save_list) {
      document.getElementById(key).value = save_list[key];
    }
  }else{
    for (let i = 0; i <= 7; i++) {
      document.getElementById("input_win" + i).value = 0;
      document.getElementById("input_lose" + i).value = 0;
    }
  }
  CalcRate();
}

// クリアボタン押下時、画面項目をすべてクリアする
function AllClear() {
  for (let i = 0; i <= 7; i++) {
    document.getElementById("input_win" + i).value = 0;
    document.getElementById("input_lose" + i).value = 0;
  }
  SaveLocalStorage();
  CalcRate();
}

// 勝敗ボタン押下時処理
function AddBattleRecord(leader_id, won) {
  if(won){
    let input_field = document.getElementById("input_win" + leader_id);
    input_field.value = Number(input_field.value) + Number(1);
  }else{
    let input_field = document.getElementById("input_lose" + leader_id);
    input_field.value = Number(input_field.value) + Number(1);
  }
  SaveLocalStorage();
  CalcRate();
}

// 勝率の計算処理
function CalcRate() {
  let total_win = 0;
  let total_lose = 0;
  for (let i = 0; i <= 7; i++) {
    const win = Number(document.getElementById("input_win" + i).value);
    const lose = Number(document.getElementById("input_lose" + i).value);
    total_win += win;
    total_lose += lose;
    document.getElementById("rate" + i).textContent = (win + lose != 0) ? (win / (win + lose)*100).toFixed(1) + "%" : "None";
    ColorSetByRate("tr" + i, win, lose);
  }
  document.getElementById("total_win").textContent = total_win;
  document.getElementById("total_lose").textContent = total_lose;
  document.getElementById("total_rate").textContent = (total_win + total_lose != 0) ? (total_win / (total_win + total_lose)*100).toFixed(1) + "%" : "None";
  ColorSetByRate("tr_total", total_win, total_lose);
}

// 勝率を背景色として反映する
function ColorSetByRate(tr_id, win, lose){
  if(win > lose){
    const alpha = win / (win + lose);
    document.getElementById(tr_id).style.backgroundColor = "RGB(100,255,100," + alpha + ")";
  }else if(win < lose){
    const alpha = lose / (win + lose);
    document.getElementById(tr_id).style.backgroundColor = "RGB(255,100,100," + alpha + ")";
  }else{
    document.getElementById(tr_id).style.backgroundColor = "RGB(255,255,255,1)";
  }
}

// CSVエクスポート
function ExportCSV() {
    //data作成
    let data = "対戦相手,勝ち,負け,勝率\n"
    for (let i = 0; i <= 7; i++) {
      data += document.getElementById("class" + i).textContent + ",";
      data += document.getElementById("input_win" + i).value + ",";
      data += document.getElementById("input_lose" + i).value + ",";
      data += document.getElementById("rate" + i).textContent + "\n";
    }
    //download実行  
    const filename = `${document.getElementById("my_class").value}戦績(${GetSysdateYYYYMMDD()}).csv`;
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, data], { type: "text/csv"});
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const download = document.createElement("a");
    download.href = url;
    download.download = filename;
    download.click();
    (window.URL || window.webkitURL).revokeObjectURL(url);
}

// システム日付をYYYYMMDD形式で取得
function GetSysdateYYYYMMDD()
{
  var now = new Date();
  var yyyymmdd = now.getFullYear() + ("0" + (now.getMonth()+1)).slice(-2) + ("0"+now.getDate()).slice(-2);
  return yyyymmdd;
}