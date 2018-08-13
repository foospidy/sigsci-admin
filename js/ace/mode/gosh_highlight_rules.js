define(function(require, exports, module) {
    var oop = require("../lib/oop");
    var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var GolangHighlightRules = function() {
        var keywords = (
            "if|else|range"
        );
        var builtinTypes = (
            "string|uint8|uint16|uint32|uint64|int8|int16|int32|int64|float32|Array|" +
            "float64|complex64|complex128|byte|rune|uint|int|uintptr|bool|error|" +
            "IPAttrSet|"
        );
        var builtinFunctions = (
            "AddrInNetwork|AddrIsPrivate|AddrIsValid|AllTrueQ|AnyTrueQ|" +
            "Assert|Base64Decode|Base64DecodeStd|Base64DecodeStdRaw|Base64DecodeURL|" +
            "Base64DecodeURLRaw|Base64Encode|Base64EncodeStd|Base64EncodeStdRaw|Base64EncodeURL|" +
            "Base64EncodeURLRaw|ContainsAll|ContainsAny|ContainsExactly|ContainsNone|" +
            "ContainsOnly|Debug|DeepEqual|Discard|Drop|EmptyQ|Equal|FeatureEnabled|" +
            "First|Greater|GreaterEqual|HTMLDecode|HTMLEncode|HTTPCookiesAsMap|" +
            "HTTPParseCookieHeaders|HTTPParseCookies|HTTPParseSetCookieHeaders|" +
            "HasNull|HTTPParseSetCookies|HexDecode|HexEncode|IgnoreCase|IsASCII|IsAlpha|" +
            "IsAlphaNumeric|IsCmdExeV0|IsCodeInjectionPhpV0|IsHostname|IsPrintable|" +
            "IsUTF8|KeyExistsQ|Last|Less|LessEqual|Log|Lookup|LookupAll|LowerCase" +
            "MD5Sum|NetworkContainsQ|NoneTrueQ|NormalizePath|NotEqual|PathBase|" +
            "PathDirectory|PathExtention|PathMatchQ|RandomFloat|RandomInteger|" +
            "RegexpCompile|RegexpMatch|RegexpQuoteMeta|Reverse|SHA1Sum|SHA256Sum|" +
            "SHA512Sum|SetClientIP|SetPath|SetProtocol|SetRequestHeader|SetResponseHeader|" +
            "SetTLSCipher|SetTLSProtocol|StringArray|StringContainsQ|StringEndsQ|" +
            "StringEqualsQ|StringJoin|StringLastIndex|StringReplace|StringReverse" +
            "StringSlice|StringSplit|StringStartsQ|StringTrim|Take|TimeHour|" +
            "TimeMillisecond|TimeMinute|TimeNanosecond|TimeNow|TimeParse|TimeSecond|" +
            "TimeUnix|TimeZero|Type|URLDecodePath|URLDecodeQuery|URLEncodePath|" +
            "URLEncodeQuery|URLHost|URLPath|URLQuery|URLScheme|UpperCase|MatchOne|" +
            "NewAhoCorasickMatcher|NewEqualityMatcher|NewHashMatcher|HeaderMap|" +
            "ImportNewIPAttrSet|NewIPAttrSet|AddAttr|AddRangeAttr|AddSignal|AddTag"
        );
        var builtinConstants = ("nil|true|false|iota");

        var keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": builtinConstants,
            "support.function": builtinFunctions,
            "support.type": builtinTypes
        }, "");
        
        var stringEscapeRe = "\\\\(?:[0-7]{3}|x\\h{2}|u{4}|U\\h{6}|[abfnrtv'\"\\\\])".replace(/\\h/g, "[a-fA-F\\d]");

        this.$rules = {
            "start" : [
                {
                    token : "comment",
                    regex : "#.*$"
                },
                DocCommentHighlightRules.getStartRule("doc-start"),
                {
                    token : "comment.start", // multi line comment
                    regex : "\\/\\*",
                    next : "comment"
                }, {
                    token : "string", // single line
                    regex : /"(?:[^"\\]|\\.)*?"/
                }, {
                    token : "string", // raw
                    regex : '`',
                    next : "bqstring"
                }, {
                    token : "constant.numeric", // rune
                    regex : "'(?:[^\\'\uD800-\uDBFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|" + stringEscapeRe.replace('"', '')  + ")'"
                }, {
                    token : "constant.numeric", // hex
                    regex : "0[xX][0-9a-fA-F]+\\b" 
                }, {
                    token : "constant.numeric", // float
                    regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                }, {
                    token : ["keyword", "text", "entity.name.function"],
                    regex : "(func)(\\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\\b"
                }, {
                    token : function(val) {
                        if (val[val.length - 1] == "(") {
                            return [{
                                type: keywordMapper(val.slice(0, -1)) || "support.function",
                                value: val.slice(0, -1)
                            }, {
                                type: "paren.lparen",
                                value: val.slice(-1)
                            }];
                        }
                        
                        return keywordMapper(val) || "identifier";
                    },
                    regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b\\(?"
                }, {
                    token : "keyword.operator",
                    regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^="
                }, {
                    token : "punctuation.operator",
                    regex : "\\?|\\:|\\,|\\;|\\."
                }, {
                    token : "paren.lparen",
                    regex : "[[({]"
                }, {
                    token : "paren.rparen",
                    regex : "[\\])}]"
                }, {
                    token : "text",
                    regex : "\\s+"
                }
            ],
            "comment" : [
                {
                    token : "comment.end",
                    regex : "\\*\\/",
                    next : "start"
                }, {
                    defaultToken : "comment"
                }
            ],
            "bqstring" : [
                {
                    token : "string",
                    regex : '`',
                    next : "start"
                }, {
                    defaultToken : "string"
                }
            ]
        };

        this.embedRules(DocCommentHighlightRules, "doc-",
            [ DocCommentHighlightRules.getEndRule("start") ]);
    };
    oop.inherits(GolangHighlightRules, TextHighlightRules);

    exports.GolangHighlightRules = GolangHighlightRules;
});