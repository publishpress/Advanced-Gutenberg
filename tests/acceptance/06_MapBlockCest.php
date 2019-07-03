<?php

class MapBlockCest
{
    public function _before(AcceptanceTester $I)
    {
        try {
            // Back to edit post
            $I->click('Edit Post');
            $I->waitForElement('#editor');
            $I->waitForElement('.advgb-map-block');
            $I->clickWithLeftButton('//*[@class="advgb-map-block"]');
        } catch(Exception $e) {
            // do stuff
        }
    }

    public function _after(AcceptanceTester $I)
    {
    }

    public function createMapBlock(AcceptanceTester $I)
    {
        $I->loginAsAdmin('admin', 'password');

        $I->wantTo('Create a Map block');

        $I->amOnPage('/wp-admin/post-new.php');

        // Hide the Tips popup
        $I->executeJS('wp.data.dispatch( \'core/nux\' ).disableTips()');

        $I->fillField('.editor-post-title__input', 'Advanced Map Block');

        // Insert block
        $I->insertBlock('Map');

        $I->dontSee('No API Key Provided!');

        $I->click('Publish…');
        $I->waitForElementVisible('.editor-post-publish-button');

        $I->click('Publish');
        $I->waitForText('Post published.');

        $I->clickViewPost();

        // Check map block exist and loaded
        $I->seeElement('//div[contains(@class, "wp-block-advgb-map")]/div[@class="advgb-map-content"]/div');
    }

    public function changeMapLocationUsingAddress(AcceptanceTester $I)
    {
        $I->wantTo('Change location of map marker using address');

        // Change location using address input
        $I->fillField('//label[text()="Address"]/following-sibling::node()', 'Hanoi');
        $I->click('//button[text()="Fetch Location"]');
        $I->waitForText('Hanoi, Vietnam');

        // Update post
        $I->click('Update');
        $I->waitForText('Post updated.');

        $I->clickViewPost();
        $I->waitForElement('.wp-block-advgb-map');

        // Check location
        $I->seeElement('//div[@class="advgb-map-content"][@data-lat="21.0277644"][@data-lng="105.83415979999995"]/div');
    }

    public function changeMapLocationUsingLatLng(AcceptanceTester $I)
    {
        $I->wantTo('Change location of map marker using lat/lng');
        // Statue of Liberty address
        $lat = '40.6892494';
        $lng = '-74.0445004';

        // Change location using address input
        $I->click('Use Lat/Lng');
        $I->waitForElement('//input[@title="Latitude"]');
        $I->fillField('//input[@title="Latitude"]', $lat);
        $I->fillField('//input[@title="Longitude"]', $lng);

        // Update post
        $I->click('Update');
        $I->waitForText('Post updated.');

        $I->clickViewPost();
        $I->waitForElement('.wp-block-advgb-map');

        // Check location
        $I->seeElement('//div[@class="advgb-map-content"][@data-lat="'.$lat.'"][@data-lng="'.$lng.'"]/div');
    }
}