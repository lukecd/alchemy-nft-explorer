"use strict";
exports.id = 206;
exports.ids = [206];
exports.modules = {

/***/ 206:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const NFTCard = ({ nft , callbackFunction  })=>{
    if (!nft) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
            children: "no nft provided"
        });
    }
    // this is our hack to manually merge the IDs
    let ownerCount = nft.ownerCount;
    let tokenIds = [];
    if (nft.isMerged) {
        console.log("is merge ", nft.mergedIds);
        ownerCount = nft.mergedCount;
        tokenIds = nft.mergedIds;
    } else {
        tokenIds[0] = nft.id.tokenId;
    }
    console.log("ownerCount=", ownerCount);
    if (nft.media[0].gateway.includes(".mp4")) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "w-1/4 flex flex-col bg-slate-600",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "rounded-md",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("video", {
                        autoPlay: true,
                        className: "object-cover h-128 w-full rounded-t-md",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("source", {
                            src: nft.media[0].gateway,
                            type: "video/mp4"
                        })
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                    className: "text-xl text-gray-800",
                                    children: nft.title
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                    className: "text-gray-600",
                                    children: [
                                        "Id: ",
                                        nft.id.tokenId.substr(nft.id.tokenId.length - 4)
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex-grow mt-2",
                            children: ownerCount && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                className: "underline",
                                onClick: (e)=>{
                                    callbackFunction(tokenIds, nft);
                                },
                                children: [
                                    "Owned By ",
                                    ownerCount,
                                    "  Wallet(s)"
                                ]
                            })
                        })
                    ]
                })
            ]
        });
    } else {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "w-1/4 flex flex-col bg-slate-600",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "rounded-md",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                        className: "object-cover h-128 w-full rounded-t-md",
                        src: nft.media[0].gateway
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                    className: "text-xl text-gray-800",
                                    children: nft.title
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                    className: "text-gray-600",
                                    children: [
                                        "Id: ",
                                        nft.id.tokenId.substr(nft.id.tokenId.length - 4)
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex-grow mt-2",
                            children: ownerCount && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                className: "underline",
                                onClick: (e)=>{
                                    callbackFunction(tokenIds, nft);
                                },
                                children: [
                                    "Owned By ",
                                    ownerCount,
                                    "  Wallet(s)"
                                ]
                            })
                        })
                    ]
                })
            ]
        });
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NFTCard);


/***/ })

};
;