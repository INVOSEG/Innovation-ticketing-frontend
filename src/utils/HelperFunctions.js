import { enqueueSnackbar } from "notistack";

function cleanDateString(dateString) {
    // Check if the string ends with 'Z' and remove it
    if (dateString?.endsWith('Z')) {
        dateString = dateString.slice(0, -1); // Remove the last character ('Z')
    }

    // Check if the string contains '+' and remove everything after it
    if (dateString?.includes('+')) {
        dateString = dateString.split('+')[0]; // Keep everything before '+'
    }

    const offsetRegex = /([+-]\d{2}:\d{2})$/;
    if (offsetRegex.test(dateString)) {
        dateString = dateString.replace(offsetRegex, ''); // Remove the UTC offset
    }

    return dateString;
}
// function cleanDateString(dateString) {
//     // Check if the string ends with 'Z' and remove it
//     if (dateString?.endsWith('Z')) {
//         dateString = dateString.slice(0, -1); // Remove the last character ('Z')
//     }

//     // Check if the string contains '+' and remove everything after it
//     if (dateString?.includes('+')) {
//         dateString = dateString.split('+')[0]; // Keep everything before '+'
//     }

//     // Remove the UTC offset if present
//     const offsetRegex = /([+-]\d{2}:\d{2})$/;
//     if (offsetRegex.test(dateString)) {
//         dateString = dateString.replace(offsetRegex, ''); // Remove the UTC offset
//     }

//     // Extract only hours, minutes, and seconds
//     const timeRegex = /^(\d{2}:\d{2}:\d{2})/; // Matches HH:mm:ss format
//     const match = dateString.match(timeRegex);
//     return match ? match[0] : ''; // Return the matched time or an empty string
// }


export function truncateString(str, maxLength) {
    if (str?.length > maxLength) {
        return str?.slice(0, maxLength) + '...';
    }
    return str;
}

export function copyToClipboard(text, typeOfText) {
    navigator?.clipboard?.writeText(text)?.then(() => {
        enqueueSnackbar(`${typeOfText ? typeOfText : 'Text'} copied to clipboard!`, { variant: "success" });
    }).catch(err => {
        enqueueSnackbar(`Could not copy ${typeOfText ? typeOfText : 'Text'}`, { variant: "error" });
        console.error('Could not copy text: ', err);
    });
}

export function getRevalidateSabreUrl(allData, code, tripType) {
    let filteredData = [];
    let returnData = {}

    if (allData?.flights) {
        const departureData = (allData?.flights || [])?.map((departure, index) => {
            return {
                RPH: (index + 1).toString(),
                DepartureDateTime: cleanDateString(`${departure?.departure?.date}T${departure?.departure?.time}`),
                OriginLocation: {
                    LocationCode: departure.departure?.airport
                },
                DestinationLocation: {
                    LocationCode: departure.arrival?.airport
                },
                TPA_Extensions: {
                    Flight: [
                        {
                            ClassOfService: allData?.itineraries?.[0]?.bookingCode?.[index] || "", // Placeholder for class of service
                            Number: departure.marketingFlightNumber,
                            DepartureDateTime: cleanDateString(`${departure?.departure?.date}T${departure?.departure?.time}`),
                            ArrivalDateTime: cleanDateString(`${departure?.arrival?.date}T${departure?.arrival?.time}`),
                            Type: "A",
                            OriginLocation: {
                                LocationCode: departure.departure?.airport
                            },
                            DestinationLocation: {
                                LocationCode: departure.arrival?.airport
                            },
                            Airline: {
                                Marketing: departure.marketing
                            }
                        }
                    ]
                }
            };
        });

        filteredData = departureData
    } else {
        // Correct the array access and mapping for departureData
        // const departureData = (allData?.itineraries?.[0]?.departure || [])?.map((departure, index) => {
        //     return {
        //         RPH: (index + 1).toString(),
        //         DepartureDateTime: cleanDateString(departure.departureTime),
        //         OriginLocation: {
        //             LocationCode: departure.departureLocation
        //         },
        //         DestinationLocation: {
        //             LocationCode: departure.arrivalLocation
        //         },
        //         TPA_Extensions: {
        //             Flight: [
        //                 {
        //                     ClassOfService: allData?.itineraries?.[0]?.bookingCode?.[0], // Placeholder for class of service
        //                     Number: departure.marketingFlightNumber,
        //                     DepartureDateTime: cleanDateString(departure.departureTime),
        //                     ArrivalDateTime: cleanDateString(departure.arrivalTime),
        //                     Type: "A",
        //                     OriginLocation: {
        //                         LocationCode: departure.departureLocation
        //                     },
        //                     DestinationLocation: {
        //                         LocationCode: departure.arrivalLocation
        //                     },
        //                     Airline: {
        //                         Marketing: departure.marketing
        //                     }
        //                 }
        //             ]
        //         }
        //     };
        // });

        const departureData = {
            RPH: "1",
            DepartureDateTime: cleanDateString(allData?.itineraries?.[0]?.departure?.[0]?.departureTime),
            OriginLocation: {
                LocationCode: allData?.itineraries?.[0]?.departure?.[0]?.departureLocation
            },
            DestinationLocation: {
                LocationCode: allData?.itineraries?.[0]?.departure?.[allData?.itineraries?.[0]?.departure?.length - 1].arrivalLocation
            },
            TPA_Extensions: {
                Flight: (allData?.itineraries?.[0]?.departure || [])?.map((departure, index) => {
                    return {
                        ClassOfService: allData?.itineraries?.[0]?.bookingCode?.[index] || "", // Placeholder for class of service
                        Number: departure.marketingFlightNumber,
                        DepartureDateTime: cleanDateString(departure.departureTime),
                        ArrivalDateTime: cleanDateString(departure.arrivalTime),
                        Type: "A",
                        OriginLocation: {
                            LocationCode: departure.departureLocation
                        },
                        DestinationLocation: {
                            LocationCode: departure.arrivalLocation
                        },
                        Airline: {
                            Marketing: departure.marketing
                        }
                    }
                })
            }
        }

        // if (allData?.itineraries?.[0]?.return) {
        //     returnData = allData?.itineraries?.[0]?.return?.map((departure, index) => {
        //         return {
        //             RPH: (allData?.itineraries?.[0]?.departure?.length + 1).toString(),
        //             DepartureDateTime: cleanDateString(departure.departureTime),
        //             OriginLocation: {
        //                 LocationCode: departure.departureLocation
        //             },
        //             DestinationLocation: {
        //                 LocationCode: departure.arrivalLocation
        //             },
        //             TPA_Extensions: {
        //                 Flight: [
        //                     {
        //                         ClassOfService: allData?.itineraries?.[0]?.bookingCode?.[0], // Placeholder for class of service
        //                         Number: departure.marketingFlightNumber,
        //                         DepartureDateTime: cleanDateString(departure.departureTime),
        //                         ArrivalDateTime: cleanDateString(departure.arrivalTime),
        //                         Type: "A",
        //                         OriginLocation: {
        //                             LocationCode: departure.departureLocation
        //                         },
        //                         DestinationLocation: {
        //                             LocationCode: departure.arrivalLocation
        //                         },
        //                         Airline: {
        //                             Marketing: departure.marketing
        //                         }
        //                     }
        //                 ]
        //             }
        //         };
        //     });
        // }

        if (allData?.itineraries?.[0]?.return) {
            returnData = {
                RPH: "2",
                DepartureDateTime: cleanDateString(allData?.itineraries?.[0]?.return?.[0]?.departureTime),
                OriginLocation: {
                    LocationCode: allData?.itineraries?.[0]?.return?.[0]?.departureLocation
                },
                DestinationLocation: {
                    LocationCode: allData?.itineraries?.[0]?.return?.[allData?.itineraries?.[0]?.return?.length - 1].arrivalLocation
                },
                TPA_Extensions: {
                    Flight: allData?.itineraries?.[0]?.return?.map((departure, index) => {
                        return {
                            ClassOfService: allData?.itineraries?.[0]?.bookingCode?.[index], // Placeholder for class of service
                            Number: departure.marketingFlightNumber,
                            DepartureDateTime: cleanDateString(departure.departureTime),
                            ArrivalDateTime: cleanDateString(departure.arrivalTime),
                            Type: "A",
                            OriginLocation: {
                                LocationCode: departure.departureLocation
                            },
                            DestinationLocation: {
                                LocationCode: departure.arrivalLocation
                            },
                            Airline: {
                                Marketing: departure.marketing
                            }
                        }
                    })
                }
            };
        }

        // Assuming you want to do something with returnData, like assigning the result
        // filteredData = [...departureData, ...returnData];

        if (Object.keys(returnData).length !== 0 && returnData.constructor === Object) {
            filteredData = [departureData, returnData]
        } else {
            filteredData = [departureData]
        }
    }



    return filteredData; // Return the result from the function
}


export function removeLastWord(inputString) {
    // Split the string into words, remove the last one, and join the rest back into a string
    const words = inputString.split(' ');
    words.pop();  // Remove the last word
    return words.join(' ');  // Join the remaining words
}

export function removeTitles(inputString) {
    // List of titles to remove (case-insensitive)
    const titles = ["Mr", "Mrs", "Miss", "Mstr"];

    // Create a regular expression pattern to match any of the titles in different cases
    // It matches if the title is at the start or end or is followed by non-alphabetical characters.
    const titleRegex = new RegExp(`^(${titles.join('|')})|(${titles.join('|')})$`, 'i');

    // Remove titles if found at the beginning or end of the string
    let cleanedString = inputString.replace(titleRegex, '')?.replace("/", "")?.trim();

    // Return the cleaned string
    return cleanedString;
}

export function getTitle(inputString) {
    // List of titles to remove (case-insensitive)
    const titles = ["Mr", "Mrs", "Miss", "Mstr"];

    // Create a regular expression pattern to match any of the titles at the start or end
    // Match the title case-insensitively
    const titleRegex = new RegExp(`^(${titles.join('|')})|(${titles.join('|')})$`, 'i');

    // Declare a variable to store the matched title in its proper format
    let matchedTitle = null;

    // Test if the inputString matches any of the titles and capture it
    const match = titleRegex.exec(inputString);

    // If a match is found, capture the title and remove it
    if (match) {
        // Match can be in two parts, so we check both groups
        matchedTitle = match[1] || match[2];  // match[1] or match[2] contains the title

        // Capitalize the first letter of the matched title
        matchedTitle = matchedTitle.charAt(0).toUpperCase() + matchedTitle.slice(1).toLowerCase();
    }

    return matchedTitle
}

export function removeSeconds(inputString) {
    // Use a regular expression to match the first part of the time (HH:MM)
    const match = inputString.match(/^\d{2}:\d{2}/);

    // Return the matched time or an empty string if no match found
    return match ? match[0] : '';
}

export function capitalizeFirstLetter(str) {
    return str
        ? str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase()
        : '';
}

export function calculateStops(flightData) {
    if (flightData?.length - 1) {
        console.log(flightData, "flightData")
        const viaLocations = flightData
            .slice(1) // skip the first segment
            .map(segment => segment.departureLocation || segment.departure?.airport || segment?.departure?.departure?.airport)
            .join(', ');

        return `${flightData?.length - 1} stop, via ${viaLocations}`;
    } else {
        return "Non stop";
    }
}

export function getCheckinText(type, flight) {
    const baggage = flight?.extra?.[type]?.baggage?.[0]?.allowanceDetail || flight?.extra?.[type]?.baggage;
    if (Array.isArray(baggage) && baggage?.[0]?.checkedBags && baggage[0].checkedBags?.quantity) {
        return `${baggage[0].checkedBags?.quantity} pcs`
    }

    if (baggage?.pieceCount) {
        return `${baggage?.pieceCount} pc`
    }

    if (Array.isArray(baggage) && baggage?.[0]?.checkedBags && baggage[0].checkedBags?.weight) {
        return `${baggage[0].checkedBags?.weight} ${baggage[0].checkedBags?.weightUnit ? baggage[0].checkedBags?.weightUnit : ''}`
    }

    if (Array.isArray(baggage) && baggage?.[0]?.type) {
        return `${baggage?.[0]?.weight} ${baggage.unit || 'kg'}`
    }

    return (baggage && baggage?.weight && baggage?.unit) ? `${baggage?.weight} ${baggage?.unit}` : 'No Baggage Info';
};

export function getCabinText(type, flight) {
    const cabin = flight?.extra?.[type]?.cabin?.[0]; // Assuming weight like '7' or class 'Y'
    return cabin ? '7 Kg' : 'No Baggage Info'; // Adjust if weight info is available
};

function parseElapsedTime(duration) {
    const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    return {
        hours: parseInt(match?.[1] || '0'),
        minutes: parseInt(match?.[2] || '0')
    };
}

function parseLayoverTime(duration) {
    if (!duration) return { hours: 0, minutes: 0 };
    const match = duration.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/i);
    return {
        hours: parseInt(match?.[1] || '0'),
        minutes: parseInt(match?.[2] || '0')
    };
}

function getTimeDifference(date1, date2, isLayover) {
    if (!isLayover) return `0h 0m`;

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Difference in milliseconds
    let diffMs = Math.abs(d2 - d1);

    // Convert to minutes & hours
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
}

export function calculateTotalFlightTime(flightSegments) {
    let totalHours = 0;
    let totalMinutes = 0;

    if (!flightSegments) {
        return;
    }

    flightSegments.forEach((segment, index) => {
        const timeDiff = getTimeDifference(
            segment?.departure?.arrivalTime,
            segment?.departure?.departureTime, segment?.departure?.layoverTime)
        const elapsed = parseElapsedTime(segment?.departure?.elapsedTime ? segment?.departure?.elapsedTime : segment?.elapsedTime);
        const layover = parseLayoverTime(timeDiff);

        totalHours += elapsed.hours + layover.hours;
        totalMinutes += elapsed.minutes + layover.minutes;
    });

    // Normalize minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return `${String(totalHours).padStart(2, '0')} Hrs ${String(totalMinutes).padStart(2, '0')} Mins`;
}

export function extractTrips(flightSegments, trips, apiName = 'wego') {
    const getFrom = seg =>
        apiName.startsWith('amad') ? seg.departureLocation : seg.departure.airport;

    const getTo = seg =>
        apiName.startsWith('amad') ? seg.arrivalLocation : seg?.arrival?.airport;

    const result = [];
    let startIdx = 0;

    for (const trip of trips) {
        const { from, to, depart } = trip;
        const connectingFlights = [];
        let foundStart = false;

        for (let i = startIdx; i < flightSegments?.length; i++) {
            const seg = flightSegments[i];
            const segFrom = getFrom(seg);
            const segTo = getTo(seg);

            if (!foundStart && segFrom === from.code) {
                foundStart = true;
            }

            if (foundStart) {
                connectingFlights.push(seg);

                if (segTo === to.code) {
                    startIdx = i + 1; // Next search will start from after this segment
                    break;
                }
            }
        }

        if (connectingFlights?.length) {
            result.push({
                from: from.code,
                to: to.code,
                depart: depart,
                connectingFlights
            });
        }
    }

    return result;
}

export function extractTripsForMultiCity(flightSegments, trips, apiName = 'wego') {
    const getFrom = seg =>
        apiName.startsWith('amad') ? seg?.departureLocation : seg?.airport ? seg?.airport : seg?.departure?.airport;

    const getTo = seg =>
        apiName.startsWith('amad') ? seg?.arrivalLocation : seg?.airport ? seg?.airport : seg?.arrival?.airport;

    const result = [];
    let startIdx = 0;

    for (const trip of trips) {
        const { from, to } = trip;
        const connectingFlights = [];
        let foundStart = false;

        for (let i = startIdx; i < flightSegments?.length; i++) {
            const seg = flightSegments[i];
            const segFrom = getFrom(seg?.departure || seg);
            const segTo = getTo(seg?.departure || seg);


            if (!foundStart && segFrom === from.code) {
                foundStart = true;
            }

            if (foundStart) {
                connectingFlights.push(seg);

                if (segTo === to.code) {
                    startIdx = i + 1; // Next search will start from after this segment
                    break;
                }
            }
        }

        if (connectingFlights?.length) {
            result.push({
                from: from.code,
                to: to.code,
                connectingFlights
            });
        }
    }

    return result;
}

export function toTimestamp(data) {
    if (!data) {
        return;
    }

    const { date, time } = data;
    return new Date(`${date}T${time}`).getTime();
}