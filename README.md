# Http Library Documentation

## Table of Contents
1. [Types and Interfaces](#types-and-interfaces)
2. [Http Class](#http-class)
   - [Constructor](#constructor)
   - [Methods](#methods)
     - [actionRequestMethod](#actionrequestmethod)
     - [setBaseUrl](#setbaseurl)
     - [fixToken](#fixtoken)
     - [getToken](#gettoken)
     - [setToken](#settoken)
     - [withToken](#withtoken)
     - [setParam](#setparam)
     - [addMethod](#addmethod)
     - [setWithCredentials](#setwithcredentials)
     - [removeToken](#removetoken)
     - [setToast](#settoast)
     - [buildUrl](#buildurl)
     - [reset](#reset)
     - [request](#request)
     - [get](#get)
     - [addRequestMethod](#addrequestmethod)

## Types and Interfaces

### `AnyMethod`

```typescript
type AnyMethod = (...args: any[]) => any;
