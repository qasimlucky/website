function display() {  
    alert("Hello World!");  
    }
var data = {name : "qasim",  age:"23"}

console.log(data.name)

console.log(rows[0].Personid)
//console.log(tagvalue)

let li = document.createElement('li');
li.textContent = '';
let list = document.querySelector('#readMe');
list.append(li);
    

//let change = document.getElementById('readMe')
//change.innerHTML = "Name :" + rows[0].FirstName


function myFunction() {
    bigData();
    //var date= document.write(Date());
    li.outerHTML = `<li>${rows[0].Personid}</li>
                     <li>thi is me another one</li>`;
};

/*
 async function bigData(){
    console.log("==SEQUENTIAL START==");
    const slow = await resolveAfter2Seconds();
    console.log(slow);
 }
 function resolveAfter2Seconds() {
    console.log("starting slow promise");
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data)
        resolve(data);
        console.log("slow promise is done");
      }, 2000);
    });
  }
  */