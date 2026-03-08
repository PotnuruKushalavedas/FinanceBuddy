const balance = document.getElementById("balance")
const income = document.getElementById("income")
const expense = document.getElementById("expense")

const form = document.getElementById("form")
const text = document.getElementById("text")
const amount = document.getElementById("amount")
const category = document.getElementById("category")

const list = document.getElementById("list")

let transactions = JSON.parse(localStorage.getItem("transactions")) || []

function updateLocalStorage(){
localStorage.setItem("transactions", JSON.stringify(transactions))
}

function addTransaction(e){

e.preventDefault()

const transaction = {

id: Date.now(),
text: text.value,
amount: Number(amount.value),
category: category.value

}

transactions.push(transaction)

updateUI()

updateLocalStorage()

text.value=""
amount.value=""
}

form.addEventListener("submit",addTransaction)

function updateUI(){

list.innerHTML=""

let total=0
let inc=0
let exp=0

let categoryTotals={}

transactions.forEach(t=>{

const li=document.createElement("li")

li.innerHTML=
`
${t.text} (${t.category})
<span>₹${t.amount}</span>
<button class="delete" onclick="deleteTransaction(${t.id})">x</button>
`

list.appendChild(li)

total+=t.amount

if(t.amount>0) inc+=t.amount
else exp+=Math.abs(t.amount)

if(t.amount<0){
categoryTotals[t.category]=(categoryTotals[t.category]||0)+Math.abs(t.amount)
}

})

balance.innerText="₹"+total
income.innerText="₹"+inc
expense.innerText="₹"+exp

drawChart(categoryTotals)

}

function deleteTransaction(id){

transactions=transactions.filter(t=>t.id!==id)

updateLocalStorage()

updateUI()

}

let chart

function drawChart(data){

const ctx=document.getElementById("myChart")

if(chart) chart.destroy()

chart=new Chart(ctx,{

type:"pie",

data:{

labels:Object.keys(data),

datasets:[{

data:Object.values(data)

}]

}

})

}

updateUI()

function exportCSV(){

if(transactions.length === 0){
alert("No transactions to export")
return
}

let csv = "Description,Category,Amount\n"

transactions.forEach(t => {
csv += `${t.text},${t.category},${t.amount}\n`
})

const blob = new Blob([csv], { type: "text/csv" })

const url = window.URL.createObjectURL(blob)

const a = document.createElement("a")

a.setAttribute("href", url)
a.setAttribute("download", "finance_report.csv")

document.body.appendChild(a)

a.click()

document.body.removeChild(a)

}