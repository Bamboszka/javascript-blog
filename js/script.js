'use strict';

const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    console.log(event);

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log(targetArticle);

    /* add class 'active' to the correct article */
    console.log('clickedElement:', targetArticle);
    targetArticle.classList.add('active');
}

const listLinks = document.querySelector('optTitleListSelector');

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post .post-author',
    optAuthorsListSelector = '.authors.list',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-';

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
}

function generateTitleLinks(customSelector = '') {

    /* remove content of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* for each article */
    let articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';

    for (let article of articles) {
        /* get the article id */
        const articleId = article.getAttribute('id');
        /* find the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;
        /* get the title from the title element */

        /* create HTML of the link */
        const linkHTMLData = { id: articleId, title: articleTitle };
        const linkHTML = templates.articleLink(linkHTMLData);
        /* insert link into titleList */
        html = html + linkHTML;
    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    console.log(links);
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}
generateTitleLinks();

function calculateTagsParams(tags) {
    const params = { max: 0, min: 99999 };
    for (let tag in tags) {
        if (tags[tag] > params.max) {
            params.max = tags[tag];
        }
        if (tags[tag] < params.min) {
            params.min = tags[tag];
        }
    }

    return params;
}
calculateTagsParams();

function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return classNumber;
}

function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {
        /* find tags wrapper */
        const tagsWrapper = article.querySelector(optArticleTagsSelector);
        /* make html variable with empty string */
        let html = '';
        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
        console.log(articleTags);
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        /* START LOOP: for each tag */
        for (let tag of articleTagsArray) {
            /* generate HTML of the link */
            const linkHTMLData = { id: tag, title: tag };
            const linkHTML = templates.tagLink(linkHTMLData);
            /* add generated code to html variable */
            html = html + linkHTML + ' ';
            /* [NEW] check if this link is NOT already in allTags */
            if (!allTags[tag]) {
                /* [NEW] add tag to allTags object */
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
            /* END LOOP: for each tag */
        }
        /* insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;
        /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    const allTagsData = { tags: [] };

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
        /* [NEW] generate code of a link and add it to allTagsHTML */
        allTagsData.tags.push({
            tag: tag,
            count: allTags[tag],
            className: calculateTagClass(allTags[tag], tagsParams)
        });
        /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

function generateAuthors() {
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {

        /* find author wrapper */
        const authorWrapper = article.querySelector(optArticleAuthorSelector);
        /* make html variable with empty string */
        let html = '';
        /* get tags from data-author attribute */
        const author = article.getAttribute('data-author');

        /* generate HTML of the link */
        const linkHTMLData = { id: author, title: author };
        const linkHTML = templates.authorLink(linkHTMLData);
        /* add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if (!allAuthors[author]) {
            /* [NEW] add generated code to allTags array */
            allAuthors[author] = 1;
        } else {
            allAuthors[author]++;
        }

        /* insert HTML of all the links into the tags wrapper */
        authorWrapper.innerHTML = html;
        /* END LOOP: for every article: */
    }
    const authorsList = document.querySelector(optAuthorsListSelector);
    const authorsParams = calculateTagsParams(allAuthors);
    let allAuthorsData = { authors: [] };
    for (let author in allAuthors) {
        allAuthorsData.authors.push({
            author: author,
            count: allAuthors[author],
            className: calculateTagClass(allAuthors[author], authorsParams)
        });
    }
    authorsList.innerHTML = templates.authorListLink(allAuthorsData);
}

generateTags();
generateAuthors();

function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the a ttribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTag of activeTags) {
        /* remove class active */
        activeTag.classList('.active');
        /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const allTags = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let allTag of allTags) {
        /* add class active */
        allTag.classList.add('active');
        /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}
function addClickListenersToTags() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('.post-tags .list a');
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
        /* add tagClickHandler as event listener for that link */
        tagLink.addClickListeners('click', tagClickHandler);
        /* END LOOP: for each link */
    }
}
addClickListenersToTags();
function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the a ttribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all tag links with class active */
    const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active tag link */
    for (let activeAuthor of activeAuthors) {
        /* remove class active */
        activeAuthor.classList.remove('active');
        /* END LOOP: for each active tag link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const allAuthors = document.querySelectorAll('a[href="' + href + '"]');
    /*  START LOOP: for each found author link */
    for (let singleAuthor of allAuthors) {
        /*  add class active */
        singleAuthor.classList.add('active');
        /*  END LOOP: for each found author link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthor() {
    /* find all links to tags */
    const authorLinks = document.querySelectorAll('.post-author a');
    /* START LOOP: for each link */
    for (let authorLink of authorLinks) {
        /* add tagClickHandler as event listener for that link */
        authorLink.addClickListeners('click', authorClickHandler);
        /* END LOOP: for each link */
    }
}
addClickListenersToAuthor();
addClickListenersToTags();