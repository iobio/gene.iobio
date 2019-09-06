import BarChartD3          from '../d3/BarChart.d3.js';
import MultiAlignD3        from '../d3/MultiAlign.d3.js';
class MultiAlignModel {

    constructor() {
      this.alignments = null;
      this.scores = null;

      this.conservationFileName      = "../../data/rai1.pholop.100way.txt";
      this.baseMultiAlignFileName    = "../../data/multialign.RAI1.";



      this.conservationBarChart = BarChartD3()
      this.conservationBarChart.xValue(function(d) {
                      return Number(d.x)
                    })
                    .yValue(function(d) {
                      return Number(d.y)
                    })
                    .width(130)
                    .height(50)
                    .margin({top: 5, right: 2, bottom: 5, left: 4})


      this.multiAlignChart = MultiAlignD3()
      this.multiAlignChart.xValue(function(d) {
                            return d.start;
                          })
                          .margin({top: 0, right: 0, bottom: 0, left: 70})

      this.sequenceWindow = 3;

      this.primarySpeciesName = "hg19";

      this.speciesMap = {
        hg19:    'Human',
        panTro2: 'Chimp',
        gorGor1: 'Gorilla',
        ponAbe2: 'Orangutan',
        rheMac2: 'Rhesus',
        papHam1: 'Baboon'
      }


    }

    showConservationScores(regionStart, regionEnd, position) {
      let self = this;

      if (self.scores == null) {
        $.get(self.conservationFileName, function(data) {
          self.scores = []
          data.split("\n").forEach(function(rec) {
            if (rec.length > 0) {
              let fields = rec.split("\t")
              self.scores.push({  'x': +fields[1], 'y': +fields[3]});
            }
          })
          self.showConservationScoresAsBarchart(self.scores,
                               d3.select("#variant-inspect").select(".conservation-scores-barchart.exon"),
                               'mean',
                               200,
                               regionStart, regionEnd, 17698535);

        }, 'text');

      } else {
        self.showConservationScoresAsBarchart(self.scores,
                     d3.select("#variant-inspect").select(".conservation-scores-barchart.exon"),
                     'mean',
                     200,
                     17696263, 17701827, 17698535);

      }



    }

    showMultiAlignments() {
      let self = this;


      let promises = [];



      if (self.alignments == null) {
        self.alignments = [];
        self.promiseGetMultiAlignments(self.baseMultiAlignFileName + self.primarySpeciesName + ".txt")
        .then(function(data) {
          self.alignments.push(data);

          for (var species in self.speciesMap) {
            if (species != self.primarySpeciesName) {
              let p = self.promiseGetMultiAlignments(self.baseMultiAlignFileName + species + ".txt")
              .then(function(data) {
                self.alignments.push(data);
              })
              promises.push(p);
            }
          }

          Promise.all(promises)
          .then(function() {
            self.setMultiAlignSimilarity(self.alignments);

            let data = self.getMultiAlignSequencesForVariant(self.alignments, 17698535, self.sequenceWindow);
            self.multiAlignChart(d3.select("#variant-inspect").select(".multi-align-chart.variant"),
                                data.sequences,
                                {scrollable: false, showXAxis: false});
            self.multiAlignChart.setMarker()(data.selectedBase)

          })
        })
      } else {
          let data = self.getMultiAlignSequencesForVariant(self.alignments, 17698535, self.sequenceWindow);
          self.multiAlignChart(d3.select("#variant-inspect").select(".multi-align-chart.variant"),
                                data.sequences,
                                {scrollable: false, showXAxis: false});
          self.multiAlignChart.setMarker()(data.selectedBase)

      }



    }

    getMultiAlignSequencesForExon(alignments, index) {
      let self = this;
      let sequences = [];
      alignments.forEach(function(alignment) {
        let region = alignment.regions[index];
        sequences.push({name: region.species, sequence: alignment.sequences[index]});
      })
      return sequences;
    }


    getMultiAlignSequencesForVariant(alignments, start, regionLength) {
      let self = this;

      let filteredSequences = [];
      let selectedBase = null;
      let windowStart = start - regionLength;
      let windowEnd   = start + regionLength;


      let regionIndex = -1;
      alignments[0].regions.forEach(function(region, i) {
        if (start >= region.start  && start <= region.end) {
          regionIndex = i;
        }
      })
      if (regionIndex >= 0) {
        let selectedBases = alignments[0].sequences[regionIndex].filter(function(seq) {
          return seq.start == start;
        })
        if (selectedBases.length > 0) {
          selectedBase = selectedBases[0]
        }
        let sequences = self.getMultiAlignSequencesForExon(alignments, regionIndex)
        sequences.forEach(function(sequence) {
          let filteredSeqs = sequence.sequence.filter(function(seq) {
            return seq.start >= windowStart && seq.start <= windowEnd;
          })
          filteredSequences.push({name: sequence.name, sequence: filteredSeqs})
        })
      }

      return {sequences: filteredSequences, selectedBase: selectedBase};
    }


    promiseGetMultiAlignments(fileName) {
      let self = this;
      return new Promise(function(resolve, reject) {
        $.get(fileName, function(data) {


          let geneName = null;
          let species = null;
          let chrom = null;
          let start= null;
          let end = null;

          let buf = "";
          let regions = [];
          let sequences = [];

          data.split("\n").forEach(function(rec) {
            if (rec.indexOf("#") == 0) {

              if (geneName != null) {
                let sequence = Array.from(buf, function(character, i) {
                  return {start: i + start, offset: i, base: character }
                })
                sequences.push(sequence)
              }

              let tokens       = rec.split(" ");

              geneName         = tokens[0].substr(1, tokens.length+1)

              let region       = tokens[1].substr(0, tokens[1].length-1);
              let regionTokens = region.split(":");
              chrom            = regionTokens[0];
              let posTokens    = regionTokens[1].split("-");
              start            = Number(posTokens[0]);
              end              = Number(posTokens[1]);

              species          = tokens[2];

              regions.push({chrom: chrom, start: start, end: end, species: self.speciesMap[species], geneName: geneName })

            } else if (rec.indexOf(">") == 0) {

            } else {
              buf += rec;
            }
          })
          let sequence = Array.from(buf, function(character, i) {
            return {offset: i, base: character }
          })
          sequences.push(sequence)

          resolve( {species: self.speciesMap[species], geneName: geneName, sequences: sequences, regions: regions})
        })
      })

    }

    setMultiAlignSimilarity(alignments) {
      let self = this;
      let primaryAlignment = alignments[0];
      for (var i = 0; i < primaryAlignment.sequences.length; i++) {
        let primarySequence    = primaryAlignment.sequences[i];
        let primaryRegion      = primaryAlignment.regions[i];

        for (var j = 0; j < primarySequence.length; j++) {
          let primarySeq = primarySequence[j];
          primarySeq.start = primaryRegion.start + primarySeq.offset;

          for (var x = 1; x < alignments.length; x++) {
            let theSeq = alignments[x].sequences[i][j];
            theSeq.start = primaryRegion.start + theSeq.offset;
            if (theSeq.base == primarySeq.base) {
              theSeq.clazz = "same";
            } else {
              theSeq.clazz = "diff"
            }
          }
        }
      }
    }


    showConservationScoresAsBarchart(scoresAll, container, reducePointsType, pixels, start, end, position) {
      let self = this;

      let options = {showYAxis: true, xScale: 'linear', showXAxis: false}


      let theScores = scoresAll;
      if (start && end) {
        theScores = scoresAll.filter(function(score) {
          return score.x >= start && score.x <= end;
        })
        options.tickCount = 3;
      }

      let scores = self.reducePoints(theScores, pixels/4, null, reducePointsType)


      let selectedScore = null;
      if (position != null) {
        let selectedScores = scores.filter(function(score) {
          if (position >= score.x && position <= score.xEnd) {
            return true;
          } else {
            return false;
          }
        })
        if (selectedScores.length > 0) {
          selectedScore = selectedScores[0]
        }
      }


      self.conservationBarChart(container, scores, options);
      if (selectedScore) {
        self.conservationBarChart.setMarker()(selectedScore);
      }

    }

    reducePoints(data, pixels=500, reduceByFactor=0, type="mean") {
      let self = this;
      let factor = reduceByFactor > 0 ? reduceByFactor : Math.round(data.length / pixels)
      if (factor <= 1) {
        return data;
      } else {
        let i = 0;
        let j = 0;
        let results = [];
        let sum = 0;
        let max = 0;
        let min = 0;

        // Create a sliding window of averages
        for(i = 0; i < data.length; i+= factor) {
          // Slice from i to factor
          let avgWindow = data.slice(i, i+factor);
          for (j = 0; j < avgWindow.length; j++) {
              var y = avgWindow[j].y;
              sum += y != null ? y : 0;
              max = Math.max(max, y)
              min = Math.min(min, y)
          }
          let entry = {'x': data[i].x, 'xEnd': ((+data[i].x + factor) - 1)};
          if (type == 'mean') {
            entry.y = sum / factor;
          } else if (type == 'min') {
            entry.y = min;
          } else if (type == 'max') {
            entry.y = max;
          }
          results.push(entry)
          sum = 0;
          max = 0;
          min = 0;
        }
        return results;
      }
    }
}
export default MultiAlignModel