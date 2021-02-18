<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>{{ title }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    a {
      display: block;
    }
  </style>
</head>
<body>
  {{dir}}
{{#each files}}
<a href="{{../dir}}/{{fileName}}">{{fileName}}</a>
{{/each}}
</body>
</html>
