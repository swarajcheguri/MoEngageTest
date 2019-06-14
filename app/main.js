var search = (function () {
    let searchText = {};
    let searchTextMiddle = {};
    let scores = [];
    let items = [];
    let originalData = data;
    let fullitems = JSON.parse(JSON.stringify(originalData));
    let pagedItems = [];
    let doPagination = () => {
        pagedItems = [];
        for (let j = 0; j < fullitems.length; j++) {
            let pageItems = [];
            let i = 0
            for (; i < 10; i++) {
                pageItems.push(fullitems[j + i]);
            }
            j = j + i - 1;
            pagedItems.push(pageItems);
        }
    }
    doPagination();
    let currentPage = 1;
    let currentlyEditedItem = null;
    let currentDate = new Date().toString();
    let edit = (id) => {
        currentlyEditedItem = id;
        let itemBeingEdited = fullitems.filter(i => i._id === id)[0];
        document.getElementById("editNameText").value = itemBeingEdited.name;
        document.getElementById("editModal").style.display = "";

    };
    let saveEdit = () => {
        let newDate = new Date().toString();
        let itemBeingEdited = fullitems.filter(i => i._id === currentlyEditedItem)[0];
        itemBeingEdited.name = document.getElementById("editNameText").value;
        itemBeingEdited.date = newDate;
        document.getElementById(`${currentlyEditedItem}_name`).innerHTML = document.getElementById("editNameText").value;

        document.getElementById(`${currentlyEditedItem}_date`).innerHTML = newDate;
        document.getElementById("editModal").style.display = "none";
    }
    let closeEdit = () => {
        document.getElementById("editModal").style.display = "none";
    }

    let pagesList = [];
    let getPages = () => {
        pagesList = [currentPage];
        let maxPageList = 5;
        if (pagedItems.length > 5) {
            for (let i = 0; i < 5 && ((currentPage + i) < pagedItems.length); i++) {
                pagesList.push(currentPage + i + 1);
            }
        } else {
            for (let i = 0; i < pagesList.length && ((currentPage + i) < pagedItems.length); i++) {
                pagesList.push(currentPage + i + 1);
            }
        }
    };
    getPages();
    let createPage = () => {

        let tableRows = '';
        for (let j = 0; j < items.length; j++) {
            let i = items[j];
            if (!i) {
                continue;
            }
            tableRows = tableRows + `
        <div class="grid" id="${i._id}_rowItem">
<div class="${i._id}_rowItem">
  <input type="checkbox" class="check" onchange="search.checked(${i._id})">
</div>
<div id="${i._id}_name" class="namecolumn ${i._id}_rowItem">${i.name}</div>
<div class="${i._id}_rowItem">${i.type}</div>
<div class="${i._id}_rowItem">
  <span id="${i._id}_date">${!i.date ? currentDate : i.date}</span>
</div>
<div class="actionsgrid ${i._id}_rowItem">
<i class="far fa-edit" onclick="search.edit('${i._id}')"></i>
<i class="far fa-trash-alt" onclick="search.del('${i._id}')"></i>
</div>
</div>
`
        }

        /*
        <i class="far fa-edit" onclick="search.edit('${i._id}')"></i>
          <i class="far fa-trash-alt" onclick="search.del('${i._id}')"></i>
        */

        document.getElementById("dataTable").innerHTML = tableRows;
        let pagingHTML = ` <span>
    <input type="button"  value="&lt;&lt;" onclick="search.nextpage(1)">
  </span>
  <span>
    <input type="button"  value="&lt;" onclick="search.nextpage(search.currentPage()-1)">
  </span>`;
        for (let j = 0; j < pagesList.length; j++) {
            let i = pagesList[j];
            pagingHTML = pagingHTML + `<span><input type="button"   name="${i}" value="${i}" onclick="search.nextpage(${i})"></span>`;
        }
        pagingHTML = pagingHTML + `<span>
    <input type="button"  value="&gt;" onclick="search.nextpage(search.currentPage+1)">
  </span>
  <span>
    <input type="button"  value="&gt;&gt;" onclick="search.nextpage(search.pagedItems.length)">
  </span>`
        document.getElementById("pagingDiv").innerHTML = pagingHTML;
    }
    items = [];
    let nextpage = (pageNumber) => {
        if (pageNumber < 1) {
            pageNumber = 1;
        } else if (pageNumber > pagedItems.length) {
            pageNumber = pagedItems.length;
        }
        currentPage = pageNumber;
        items = pagedItems[currentPage - 1];
        getPages();
        createPage();

    };

    document.addEventListener("DOMContentLoaded", (event) => {
        document.getElementById("editModal").style.display = "none";
        nextpage(1);

    });

    let del = (id) => {
        let element = document.getElementById(`${id}_rowItem`);
        element.parentNode.removeChild(element);
        var itemIndex = fullitems.findIndex(i => i._id === id);
        fullitems.splice(itemIndex, 1);
        doPagination();
        getPages();
        nextpage(currentPage);
    }

    let inDebounce;
    const debounce = () => {

        clearTimeout(inDebounce)
        inDebounce = setTimeout(() => {
            let searchText = document.getElementById("search").value;

            let namesColumn = document.getElementsByClassName("namecolumn");
            searchText = searchText.toUpperCase();
            Array.from(namesColumn).forEach(element => {
                let nameContent = element.innerHTML;
                if (nameContent.toUpperCase().indexOf(searchText) > -1) {
                    element.parentNode.style.display = "";
                } else {
                    element.parentNode.style.display = "none";
                }

            });

            searchText.name = searchTextMiddle.name;
        }, 500)
    }

    let debounceSearch = () => {
        debounce();
    }

    return {
        saveEdit: saveEdit,
        closeEdit: closeEdit,
        debounceSearch: debounceSearch,
        edit: edit,
        del: del,
        currentPage: () => { return currentPage },
        pagedItems: pagedItems,
        nextpage: nextpage


    }
})();