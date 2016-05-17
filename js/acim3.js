/*global $, alert, console*/

var appInit;

appInit = function () {
    
    'use strict';
    
    var resultTemplateFactory, resultRenderer, htmlTagRemover, wikipediaXmlParser, getKeywords,
        searchResultCount = 0,
        searchResultData  = {},
        query             = $('#query'),
        searchButton      = $('#searchButton'),
        resultsWrapper    = $('#resultsWrapper');
    
    // 前回の検索キーワードを localStorage から読み出し，検索フォームにセット．
    query.val(localStorage.getItem('userQuery'));
    
    // 検索フォームで enter を押下された際も検索を実行．
    query.keypress(function (e) {
        if (e.which === 13) {
            searchButton.click();
        }
    });
    
    resultTemplateFactory = function (searchResultId, title, authors, url, keywords) {
        
        // 検索結果の html 要素を jQuery で生成．
        
        var results            = $('<div class="results fade" id="' + String() + searchResultId + '" ></div>'),
            
            // タイトル表示用
            titleBox           = $('<div class="resultBox"></div>'),
            titleLabel         = $('<div class="resultLabel"><a>Title : </a></div>'),
            titleName          = $('<div class="resultName"><a href="' + url + '" target="_blank">' + String() + title + '</a></div>'),
            
            // 著者名表示用
            authorsBox         = $('<div class="resultBox"></div>'),
            authorsLabel       = $('<div class="resultLabel"><a>Authors : </a></div>'),
            authorsName        = $('<div class="resultName"><a>' + authors + '</a></div>'),
            
            // キーワード表示用
            keywordsBox        = $('<div class="resultBox"></div>'),
            keywordsLabel      = $('<div class="resultLabel"><a>Keywords : </a></div>'),
            keywordsName       = $('<div class="resultName"></div>'),
            
            // 削除ボタン
            resultDeleteButton = $('<div class="resultDeleteButton fade">Delete</div>');
        
        resultDeleteButton.click(function () {
            
            var parentResultId = $(this).parent()[0].id;
            delete searchResultData[parentResultId];
            localStorage.setItem('searchResultData', JSON.stringify(searchResultData));
            $('#' + parentResultId).remove();
        });
        
        titleBox
            .append(titleLabel)
            .append(titleName);
        
        authorsBox
            .append(authorsLabel)
            .append(authorsName);
        
        for (var i = 0; i < keywords.length; i++) {
            
            var word = keywords[i];
            var keywordButton = $('<div class="button" id="keywordButton" title="' + word + '">' + word + '</div>');
            
            keywordButton.click(function () {
                
                query.val(this.title);
                searchButton.click();
            });
            
            keywordsName.append(keywordButton);
        }
        keywordsBox
            .append(keywordsLabel)
            .append(keywordsName);
        
        results
            .append(titleBox)
            .append(authorsBox)
            .append(keywordsBox)
            .append(resultDeleteButton);
        
        return results;
    };
    
    resultRenderer = function (title, authors, url, keywords) {
            
        var searchResultId = 'searchResult_' + searchResultCount;
        
        resultsWrapper.append(resultTemplateFactory(searchResultId, title, authors, url, keywords));

        searchResultData[searchResultId] = {title: title, authors: authors, url: url, keywords: keywords};

        localStorage.setItem('searchResultData', JSON.stringify(searchResultData));
        searchResultCount++;
    };
    
    searchButton.click(function () {
        
        var userQuery = htmlTagRemover(query.val());
        
        localStorage.setItem('userQuery', String() + userQuery);
        
        if (userQuery !== '' && userQuery !== null && userQuery !== undefined) {
            
            searchResultData = {};
            localStorage.setItem('searchResultData', JSON.stringify(searchResultData));
            resultsWrapper.empty();
            
            // $.ajax は HTTP 通信を行うメソッドです．
            // これを利用することで，HTML を部分更新することができます．
            // 基本的な利用方法は 通常の HTTP と同じです． 
            // 参考: http://semooh.jp/jquery/api/ajax/jQuery.ajax/options/
            // 参考: http://akiyoko.hatenablog.jp/entry/2014/07/21/034618
            // 参考: http://ajax.pgtop.net/category/4229716-1.html
            // $.ajax を利用しない場合は XMLHttpRequest を利用します．
            // 参考: https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest
            
            // ここでは Wikipedia の MediaWiki API を利用し，ユーザが指定したキーワードを含む記事情報の xml を ajax を取得しています．
            // ただし，MediaWiki API はクロスドメインで通信できないため，上田が作成したサーバを経由して記事情報 xml を取得しています．
            // 参考: MediaWiki API... https://www.mediawiki.org/wiki/API:Main_page
            // 参考: MediaWiki API... http://qiita.com/yubessy/items/16d2a074be84ee67c01f
            // 参考: クロスドメイン通信... http://www.goma.pw/article/2015-03-14-2/
            
            // 上田サーバ (https://acim.herokuapp.com/) に 'https://acim.herokuapp.com/acim3?wikiRequest=公立はこだて未来大学' という
            // リクエストを送信すると，上田サーバは MediaWiki API を利用し xml で記事情報を返却します．
            // MediaWiki API で同様のリクエストを送る場合は 
            //     https://ja.wikipedia.org/w/api.php?format=xml&action=query&list=search&srsearch=公立はこだて未来大学
            // と記述します．
            
            $.ajax({
                
                url      : 'http://ci.nii.ac.jp/opensearch/search?q=' + userQuery + '&format=rss&count=10', // リソース取得先の URL を指定．
                type     : 'GET', // 他にも POST，PUT，DELETE などがあります．
                                 // 参考: http://yohei-y.blogspot.jp/2005/04/rest-5-get-post-put-delete.html
                async    : true,  // 非同期で通信する場合は true, 同期通信 (通信が終了するまで他の処理を中断) の場合は false を指定． 
                dataType : 'xml', // サーバから返却されるデータのタイプを指定．
                error    : function () {    // 通信失敗時の処理を記述．
                
                    console.error('Error loading XML document');
                    console.log(userQuery);
                },
                success : function (searchResultXml) { // 通信成功時の処理を記述．
                
                    console.log("Search success : " + userQuery);
                
                    $(searchResultXml).find('item').each(function (index) {
                        
                        var title = $(this).find('title').text();
                        
                        var creators = $(this).find('creator');
                        var creatorsList = "";
                        for(var i = 0; i < creators.length; i++) {
                            if (i != 0) {
                                creatorsList += ", ";
                            }
                            creatorsList += creators.eq(i).text();
                        }
                        
                        var link = $(this).find('link').text();

                        var keywordsListArray  = [];
                        
                        $.ajax({
                            url      : link + ".rdf",
                            type     : 'GET',
                            async    : false,
                            dataType : 'xml',
                            error    : function () {
                                console.error("Error loading xml document");
                            },
                            success  : function (searchResultXml2) {

                                var keywords = $(searchResultXml2).find('topic');
                                for (var i = 0; i < keywords.length; i++) {
                                    keywordsListArray.push(keywords.eq(i).attr('dc:title'));
                                }
                            }
                        });

//                        console.log("Title:" + title + " Authors:" + creatorsList + " Keywords:" + keywordsListArray + " Link:" + link);

                        resultRenderer(title, creatorsList, link, keywordsListArray);
                    });

                }

            });
        
        } else {
            alert('何か入力してください!');
        }
    });

    
    htmlTagRemover = function (inputStr) {
        inputStr = String() + inputStr;
        inputStr = inputStr.replace(/</g, '').replace(/>/g, '');
        return inputStr;
    };
    
    (function loadResults() {
        var searchResultDataJson = localStorage.getItem('searchResultData');
        searchResultDataJson = JSON.parse(searchResultDataJson);
        
        for (var searchResultId in searchResultDataJson) {
            var articleData = searchResultDataJson[searchResultId];
            resultRenderer(articleData.title, articleData.authors, articleData.url, articleData.keywords);
        }
        
    })();

};

$(function main(){ 
    'use strict' 
    appInit();
});