// Real, publicly documented Puget Sound salmon stewardship projects.
// Sources: USFWS, WDFW, Puget Sound Partnership, WSDOT, tribal program websites.
// Adapter pattern per PLANNING.md §7 — content managed directly here; UI never changes.

import type { Project } from "@/types";

const PROJECTS: Project[] = [
  {
    id: "nisqually-delta-restoration",
    title: "Nisqually River Delta Estuary Restoration",
    slug: "nisqually-delta-restoration",
    partnerOrgs: [
      "Nisqually Indian Tribe",
      "Nisqually Land Trust",
      "U.S. Fish & Wildlife Service",
      "WDFW",
    ],
    watershedId: "nisqually",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2009,
    excerpt:
      "The largest estuary restoration in the Pacific Northwest: 1,100+ acres of tidal wetlands reconnected at the Billy Frank Jr. Nisqually National Wildlife Refuge since 2009, dramatically improving rearing habitat for juvenile Chinook.",
    description:
      "For more than a century, the Nisqually River delta was cut off from the tides by a network of agricultural dikes and earthen berms. In 2009, the Nisqually Indian Tribe, Nisqually Land Trust, and the U.S. Fish & Wildlife Service removed 8.5 miles of dikes to reconnect 762 acres of historic tidal wetlands — at the time, the largest estuarine restoration in the history of the Pacific Northwest.\n\nA second phase in 2018 reconnected an additional 338 acres, bringing the total to more than 1,100 acres of functioning tidal marsh and mudflat. Within months of each dike removal, tidal channels began reforming naturally, native marsh vegetation recovered, and monitoring detected significantly higher densities of juvenile Chinook in the restored areas compared to un-restored reference sites. Outmigrating juvenile salmon from the entire Nisqually watershed depend on this estuary as a critical transitional habitat before entering the saltwater of Puget Sound.\n\nThe project is named for Billy Frank Jr., the Nisqually tribal leader and civil rights activist whose decades of advocacy for treaty fishing rights shaped the legal and political landscape that made this restoration possible. WDFW and NOAA continue to monitor salmon use, water quality, and vegetation recovery at the site.",
  },
  {
    id: "skagit-system-cooperative",
    title: "Skagit River System Cooperative Salmon Monitoring",
    slug: "skagit-system-cooperative",
    partnerOrgs: [
      "Upper Skagit Indian Tribe",
      "Sauk-Suiattle Indian Tribe",
      "Swinomish Indian Tribal Community",
      "WDFW",
    ],
    watershedId: "skagit",
    type: "monitoring",
    status: "active",
    yearStarted: 1976,
    excerpt:
      "The Skagit River System Cooperative — a joint fisheries management body formed by the Skagit-area tribes and the State — conducts long-term salmon escapement monitoring, habitat assessments, and recovery planning across the Skagit basin.",
    description:
      "The Skagit River System Cooperative (SSC) was established in 1976 in the wake of the Boldt Decision, which reaffirmed the treaty fishing rights of Washington tribes and required co-management of shared salmon resources. The SSC coordinates the fisheries management responsibilities of the Upper Skagit Indian Tribe, Sauk-Suiattle Indian Tribe, and Swinomish Indian Tribal Community, working alongside WDFW to implement the Skagit River Salmon Management Plan.\n\nSSC biologists conduct annual spawner surveys across the Skagit, Sauk, Suiattle, and Cascade rivers using both weir counts and redd (nest) surveys. This long-term dataset spans nearly 50 years and is among the most comprehensive salmon population records in the Pacific Northwest. The data informs annual pre-season harvest forecasts, harvest quota negotiations between tribes and the state, and long-term recovery planning decisions.\n\nIn addition to population monitoring, the SSC manages hatchery programs for Skagit Chinook and coho, funds habitat restoration projects in priority subbasins, and participates in recovery planning under the Endangered Species Act. The Skagit watershed supports some of the largest remaining wild Chinook runs in Puget Sound, making this cooperative monitoring effort foundational to regional recovery efforts.",
  },
  {
    id: "cedar-river-sockeye-hatchery",
    title: "Cedar River Landsburg Mitigation Hatchery",
    slug: "cedar-river-sockeye-hatchery",
    partnerOrgs: ["City of Seattle", "Muckleshoot Indian Tribe"],
    watershedId: "lake-washington",
    type: "hatchery",
    status: "active",
    yearStarted: 1984,
    excerpt:
      "Operated jointly by Seattle Public Utilities and the Muckleshoot Indian Tribe to mitigate the impact of Landsburg Diversion Dam, the hatchery produces sockeye and Chinook supplementation stock for the Cedar River — supporting one of the largest remaining Lake Washington sockeye runs.",
    description:
      "The Cedar River has been substantially altered since Seattle began using it as a municipal water source in the early 1900s. Landsburg Dam, constructed in 1901, blocks salmon passage to approximately 90% of the Cedar River's historic spawning habitat. A diversion structure at Landsburg routes water into the Cedar River watershed but limits the flow available to salmon below the dam.\n\nIn 1984, Seattle Public Utilities (SPU) established the Landsburg Mitigation Hatchery under a formal agreement with the Muckleshoot Indian Tribe to offset these permanent habitat losses. The hatchery incubates sockeye eggs from adult broodstock collected at a weir, rearing juveniles through their first year before releasing them as smolts into the lower Cedar River. A smaller Chinook supplementation program targets the winter Chinook run, which spawns in the main stem Cedar below Landsburg.\n\nThe hatchery's sockeye production has contributed to a Lake Washington sockeye run that regularly exceeds 500,000 fish in strong years — one of the largest sockeye runs remaining in the contiguous United States. SPU and the Muckleshoot Tribe continue to jointly manage the hatchery and negotiate the annual broodstock collection and release targets under their operating agreement.",
  },
  {
    id: "wsdot-culvert-replacement",
    title: "WSDOT State Highway Culvert Replacement Program",
    slug: "wsdot-culvert-replacement",
    partnerOrgs: [
      "Washington State Department of Transportation",
      "WDFW",
      "Washington Tribes (21 co-plaintiffs)",
    ],
    watershedId: "nooksack",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2013,
    excerpt:
      "Under a federal court order affirmed by the U.S. Supreme Court in 2018, WSDOT is replacing hundreds of fish-blocking highway culverts statewide. Corrected culverts restore access to hundreds of miles of upstream spawning and rearing habitat.",
    description:
      "For decades, thousands of undersized and poorly designed culverts beneath Washington State highways blocked or impeded salmon from reaching spawning and rearing habitat upstream. In 2001, 21 treaty tribes filed U.S. v. Washington (the Culverts Case), arguing that the State's failure to maintain passable fish passage violated the implicit habitat protection guarantee of the 1855 treaty fishing right.\n\nAfter years of litigation, the U.S. District Court ruled in favor of the tribes in 2013, ordering the State to correct all barrier culverts on state highways within 17 years. The 9th Circuit Court of Appeals affirmed the ruling in 2016, and the U.S. Supreme Court upheld it by an equally divided 4-4 vote in 2018 — a landmark legal victory for tribal treaty rights. The court found that meaningful access to fish requires meaningful access to habitat.\n\nWSDOT is now in the multi-decade process of replacing or retrofitting hundreds of barrier culverts across the state. Priority is given to sites that provide the greatest habitat gain per dollar invested — typically those blocking access to large reaches of cold, intact headwater habitat. Each corrected culvert is designed to pass the 100-year flood flow and allow safe passage for all life stages of salmon. WDFW tracks corrected culverts and the stream miles re-opened as part of the Washington Salmon Recovery Dashboard.",
  },
  {
    id: "stillaguamish-chinook-recovery",
    title: "Stillaguamish Tribe Chinook Recovery Program",
    slug: "stillaguamish-chinook-recovery",
    partnerOrgs: ["Stillaguamish Tribe of Indians", "NOAA Fisheries", "WDFW"],
    watershedId: "stillaguamish",
    type: "hatchery",
    status: "active",
    yearStarted: 1997,
    excerpt:
      "The Stillaguamish Tribe operates the Portage Creek Acclimation Pond and coordinates habitat restoration, hatchery supplementation, and spawner surveys to rebuild the Stillaguamish wild Chinook population, one of the most depressed in Puget Sound.",
    description:
      "The Stillaguamish River Chinook population is among the most critically depressed in the Puget Sound ESA-listed evolutionary significant unit. Annual escapement estimates have frequently fallen below 500 natural spawners — a fraction of the recovery target established in NOAA's 2007 Puget Sound Salmon Recovery Plan.\n\nThe Stillaguamish Tribe of Indians has been the primary driver of recovery efforts in this watershed for decades. The Tribe operates the Portage Creek Acclimation Pond, which holds adult Chinook broodstock collected from the river and raises juvenile Chinook for release as part of a conservation hatchery supplementation program. The goal is to produce fish that are genetically adapted to the Stillaguamish while maintaining a population large enough to avoid extinction during the long timescale required for habitat restoration to produce results.\n\nIn parallel, the Tribe works with NOAA Fisheries, WDFW, and local landowners to restore floodplain connectivity, remove bank armoring, plant native riparian vegetation, and reduce sediment inputs in the North Fork and South Fork subbasins — the primary remaining spawning areas. Annual spawner surveys are conducted cooperatively with WDFW using both ground-based redd counts and aerial surveys. Despite the severity of the population's decline, the Tribe's integrated approach has prevented the extinction of the run and created the habitat conditions that a recovering population will need.",
  },
  {
    id: "duwamish-alive",
    title: "Duwamish Alive Habitat Restoration",
    slug: "duwamish-alive",
    partnerOrgs: [
      "Duwamish Alive Coalition",
      "King County",
      "City of Seattle",
      "Muckleshoot Indian Tribe",
    ],
    watershedId: "green-duwamish",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2005,
    excerpt:
      "A community-led coalition restoring native riparian vegetation along the lower Duwamish River through volunteer planting events, invasive removal, and bank stabilization — improving water quality and juvenile salmon corridor conditions in an urbanized estuary.",
    description:
      "The lower Duwamish River flows through one of the most industrialized corridors in the Pacific Northwest, passing through South Seattle before emptying into Elliott Bay. The river and its estuary are designated a federal Superfund site due to decades of contamination from industrial facilities, stormwater runoff, and combined sewer overflows. Despite these challenges, juvenile Chinook and other salmon species still use the lower Duwamish as a migratory corridor during their outmigration to Puget Sound.\n\nDuwamish Alive is a community coalition formed in 2005 to improve the ecological conditions of the river's shoreline through volunteer stewardship. Coalition events bring together neighborhood residents, tribal members, students, and conservation volunteers to remove invasive blackberry and English ivy, plant native willows, alders, red cedars, and other riparian species, and stabilize eroding banks. The native vegetation buffers reduce stormwater pollution entering the river, lower water temperatures through shade, and provide riparian insect communities that juvenile salmon rely on as food.\n\nThe coalition works in coordination with King County's Lower Duwamish Waterway cleanup process, the City of Seattle's Green/Duwamish Watershed restoration program, and the Muckleshoot Indian Tribe, which holds treaty fishing rights on the Duwamish and has been active in advocating for stronger cleanup standards and habitat improvements along the river.",
  },
  {
    id: "nooksack-salmon-enhancement",
    title: "Nooksack Salmon Enhancement Association Restoration",
    slug: "nooksack-salmon-enhancement",
    partnerOrgs: [
      "Nooksack Salmon Enhancement Association",
      "Nooksack Indian Tribe",
      "Whatcom Conservation District",
      "WDFW",
    ],
    watershedId: "nooksack",
    type: "youth_education",
    status: "active",
    yearStarted: 1990,
    excerpt:
      "NSEA engages schools, landowners, and volunteers in habitat restoration, water quality monitoring, and salmon-in-the-classroom programs across the Nooksack watershed, connecting communities to wild salmon recovery since 1990.",
    description:
      "The Nooksack Salmon Enhancement Association (NSEA) was founded in 1990 as a community-based organization dedicated to restoring salmon populations and their habitat in the Nooksack River watershed — a 1,000-square-mile basin in Whatcom County that drains the slopes of Mount Baker and empties into Bellingham Bay.\n\nNSEA's salmon-in-the-classroom program is one of the most established in Washington State. Each fall, the organization distributes salmon eggs to dozens of Whatcom County schools. Students raise the eggs through the eyed egg, alevin, and fry stages in classroom aquariums, learning salmon biology, water quality, and local ecology firsthand. In the spring, classes bring their fry to local streams for guided releases — an experience that research has shown significantly improves students' connection to local ecosystems and understanding of salmon recovery.\n\nBeyond education, NSEA works directly with private landowners on riparian restoration, funding native plant installation, livestock fencing to protect streambanks, and wood placement to improve in-stream habitat complexity. The organization also conducts annual water quality monitoring and spawner surveys in Nooksack tributaries. These community science datasets complement WDFW and tribal monitoring, providing broader spatial coverage of the watershed than either agency can maintain alone.",
  },
  {
    id: "skokomish-river-channel-restoration",
    title: "Skokomish River Channel & Estuary Restoration",
    slug: "skokomish-river-channel-restoration",
    partnerOrgs: [
      "Skokomish Tribe",
      "Mason County",
      "U.S. Army Corps of Engineers",
      "WDFW",
    ],
    watershedId: "skokomish",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2002,
    excerpt:
      "Decades of channelization and diking disconnected the Skokomish River from its floodplain. Ongoing restoration work — led by the Skokomish Tribe with federal and county partners — is re-establishing side-channel connectivity and estuary habitat critical for Hood Canal Chinook and chum.",
    description:
      "The Skokomish River, which flows into the southern tip of Hood Canal, has been severely altered by two major human interventions: the Cushman Hydroelectric Project, which blocks access to approximately 60 miles of the river's upper watershed spawning habitat, and a 20th-century channelization and diking project that disconnected the lower river from its natural floodplain. Together, these alterations have contributed to some of the lowest Chinook and chum salmon escapement levels in the entire Hood Canal system.\n\nThe Skokomish Tribe has led a multi-decade effort to restore the lower river and its estuary. Beginning in 2002, the Tribe partnered with Mason County, the U.S. Army Corps of Engineers, and WDFW to remove or breach dikes, re-establish side-channel connectivity, and replant native riparian vegetation across hundreds of acres of former floodplain. Restored side channels provide lower-velocity, warmer refugia for juvenile salmon and reduce the river's tendency to flood agricultural land through natural storage capacity.\n\nThe Tribe has also been a persistent advocate for improved flow releases from the Cushman Dams, which are operated by Tacoma Power under a federal license. Negotiations over license renewal requirements have been ongoing for years, with the Tribe seeking minimum flows and fish passage facilities that would restore access to upper watershed habitat. The combined habitat restoration and flow advocacy work represents one of the most comprehensive salmon recovery efforts on the Hood Canal.",
  },
  {
    id: "snohomish-wria7-salmon-recovery",
    title: "WRIA 7 Snohomish Basin Salmon Recovery Plan",
    slug: "snohomish-wria7-salmon-recovery",
    partnerOrgs: [
      "Snohomish County",
      "Tulalip Tribes",
      "Stillaguamish Tribe of Indians",
      "Puget Sound Salmon Recovery Council",
    ],
    watershedId: "snohomish",
    type: "research",
    status: "active",
    yearStarted: 2005,
    excerpt:
      "The WRIA 7 Steering Committee coordinates watershed-scale Chinook recovery planning across the Snohomish basin, prioritizing habitat projects, levee setbacks, and riparian buffer restoration informed by long-term population monitoring.",
    description:
      "Washington's salmon recovery process is organized around Water Resource Inventory Areas (WRIAs), geographic units that correspond roughly to major watershed basins. WRIA 7 covers the Snohomish River system, including the Snoqualmie and Skykomish rivers — a large and ecologically important basin that includes significant remaining agricultural land, rapidly developing suburban areas, and some of the most intact salmon-bearing tributary habitat in the Central Puget Sound region.\n\nThe WRIA 7 Steering Committee was established under Washington's Salmon Recovery Act (RCW 77.85) and is convened by Snohomish County. The committee includes county and city governments, the Tulalip Tribes and Stillaguamish Tribe of Indians (both of which hold treaty rights in the watershed), conservation districts, and WDFW. The committee reviews and prioritizes habitat project proposals from the watershed using a scientifically defensible project ranking process, then submits funded project lists to the Puget Sound Salmon Recovery Council for state and federal funding allocation.\n\nKey priorities in the current recovery plan include levee setbacks to restore floodplain connectivity on the lower Snohomish and Snoqualmie rivers, riparian buffer restoration on agricultural reaches, culvert correction on county roads, and stormwater management improvements in developing areas. Annual reports track project implementation and connect habitat investments to long-term population monitoring data collected by the Tribes and WDFW.",
  },
];

export function getProjects(options?: {
  type?: string;
  watershedId?: string;
}): Project[] {
  let results = PROJECTS;
  if (options?.type)
    results = results.filter((p) => p.type === options.type);
  if (options?.watershedId)
    results = results.filter((p) => p.watershedId === options.watershedId);
  return results;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
