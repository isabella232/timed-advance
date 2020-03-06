# Timed advance (in alpha)

*This plug-in is currently being tested, but has so far worked well.*


## Description

This plug-in sets the field to auto-advance after a set period of time has passed, displaying that timer. It supports all five plug-in field types.

## Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `text`, `integer`, `decimal`, `select_one`, `select_multiple`|
| Default values | Yes |
| Custom constraint message | Yes |
| Custom required message | Yes |
| Read only | No |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `numbers` appearance | Yes (`text` only) |
| `numbers_decimal` appearance | Yes (`text` only) |
| `numbers_phone` appearance | Yes (`text` only) |
| `show_formatted` appearance | No |
| `quick` appearance | Yes (`select_one` only) |
| `minimal` appearance | No |
| `compact` appearance | No |
| `compact-#` appearance | No |
| `quickcompact` appearance | No |
| `quickcompact-#` appearance | No |

## How to use

**To use this plug-in as-is**, just download the [timedadvance.fieldplugin.zip](timedadvance.fieldplugin.zip) file from this repo, and attach it to your form.

To create your own field plug-in using this as a template, follow these steps:

1. Fork this repo
1. Make changes to the files in the `source` directory.

    * **Note:** be sure to update the `manifest.json` file as well.

1. Zip the updated contents of the `source` directory.
1. Rename the .zip file to *yourpluginname*.fieldplugin.zip (replace *yourpluginname* with the name you want to use for your plug-in).
1. You may then attach your new .fieldplugin.zip file to your form as normal.

**Important:** When using on a `select_one` or `select_multiple` field, you need to include a choice with the value of `-99`. This choice will be hidden by the plug-in, but it will be selected if the time runs out without a choice selected.

## Parameters
There are two parameters, but they are both optional:
1. The time in seconds until the field auto-advances (no matter the unit used, always specify this value in seconds). Default: 10 seconds
1. The unit that will be displayed. Default: seconds

You can use the following display units:

|**Abbr.**|**Full name**|**Unit in 1 second**|
|:---|:---|:---|
|`s`|seconds|1
|`ds`|deciseconds|10
|`cs`|centiseconds|100
|`ms`|milliseconds|1000

For example, if you would like the field to move forward after 20 seconds, you can use this *appearance*:

    timedadvance(duration=20)

If you would like the time to be displayed in milliseconds, you can use this *appearance*:

    timedadvance(duration=20, unit='ms')

If the field is a *select_one*, and you would like it to have the `quick` appearance, and the field should last 15 seconds, you can use this *appearance*:

    quick timedadvance(duration=15)

## More resources

* **Test form**  
You can find a form definition in this repo here: [extras/test-form](extras/test-form).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)