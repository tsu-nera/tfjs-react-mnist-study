module.exports = {
    "extends": ["airbnb", "prettier"],
    "plugins": ["prettier"],
    "rules": {
        "prettier/prettier": "error",
        "react/prop-types": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-one-expression-per-line": 0,
        "react/destructuring-assignment": 0,
        "react/no-danger": 0,
        "jsx-a11y/anchor-is-valid": 0,
        'prefer-destructuring': 0,
    }   
};